from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta

class Facility(models.Model):
    FACILITY_TYPE = [
        ('personal', 'Personal'),
        ('corporate', 'Corporate'),
    ]
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=FACILITY_TYPE, default='personal')
    corporate_domain = models.CharField(max_length=100, null=True, blank=True)  # например kaspi.kz
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.type})"


class User(AbstractUser):
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    points = models.IntegerField(default=0)

    # глобальная роль убрана — теперь роли на уровне фасилити
    def __str__(self):
        return self.email


class UserFacilityMembership(models.Model):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('leader', 'Leader'),
        ('admin', 'Admin'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='facility_memberships')
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='memberships')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'facility')

    def __str__(self):
        return f"{self.user.email} → {self.facility.name} ({self.role})"


class Wallet(models.Model):
    membership = models.OneToOneField(UserFacilityMembership, on_delete=models.CASCADE, related_name='wallet')
    points = models.IntegerField(default=0)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return f"{self.membership.user.email} @ {self.membership.facility.name} : {self.points} points"


class Sendcode(models.Model):
    email = models.EmailField()
    code = models.CharField(max_length=5)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=10)

    def __str__(self):
        return f"{self.email} : {self.code} ({'used' if self.is_used else 'active'})"


class Room(models.Model):
    name = models.CharField(max_length=50, blank=True, null=True)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name="rooms", blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.facility.name})"


class Report(models.Model):
    REPORT_TYPES = [
        ('computer', 'Computer is broken'),
        ('light', 'Light Issue'),
        ('water', 'Water/plumbing'),
        ('internet', 'Wifi/Internet'),
        ('heating', 'Heating/Cooling'),
        ('other', 'Other'),
    ]
    STATUS_TYPES = [
        ('pending', 'Pending'),
        ('resolved', 'Resolved'),
        ('urgent', 'Urgent')
    ]

    room = models.ForeignKey(Room, related_name='reports', on_delete=models.CASCADE)
    report_type = models.CharField(max_length=50, choices=REPORT_TYPES)
    description = models.TextField(max_length=250)
    status = models.CharField(max_length=50, choices=STATUS_TYPES, default='pending')
    attachment = models.FileField(upload_to='documents/', null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports', null=True, blank=True)
    user_name = models.CharField(max_length=25)
    report_date = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # +1 поинт юзеру за новый репорт
        if not self.pk and self.user:
            self.user.points = (self.user.points or 0) + 1
            self.user.save()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.report_type} in {self.room.name} ({self.status})"


class Product(models.Model):
    name = models.CharField(max_length=50, unique=True, blank=True, null=True)
    label = models.CharField(max_length=100, blank=True, null=True)
    price = models.IntegerField(default=0)

    def __str__(self):
        return self.label or self.name


class Redeem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    redeem_date = models.DateTimeField(auto_now_add=True)
    code = models.CharField(default=0)

    def __str__(self):
        return f"{self.user.email} redeemed {self.product.label}"
