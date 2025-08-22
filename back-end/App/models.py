from django.db import models
from django.urls import reverse
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.contrib.auth.models import BaseUserManager
from django.utils import timezone
from datetime import timedelta
from django.db.models import UniqueConstraint   
from django.db.models import Q



class User(AbstractUser):
    class Role(models.TextChoices):
        USER = "user", "User"
        LEADER = "leader", "Leader"
        ADMIN = "admin", "Admin"
    email = models.EmailField(unique=True,blank=True,null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    points = models.IntegerField(default=0)
    role = models.CharField(max_length=20, default=Role.USER)
    created_at = models.DateField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)

class Organization(models.Model):
    title = models.CharField(max_length=150)
    created_at = models.DateField(auto_now_add=True)
    users = models.ManyToManyField(User, through="OrganizationMembership",related_name="organizations")


class Facility(models.Model):
    name = models.CharField(max_length=150,null=True,blank=True)
    organization = models.ForeignKey(
        Organization, null=True, blank=True,
        on_delete=models.CASCADE, related_name="facilities"
    )
    owner = models.ForeignKey(
        User, null=True, blank=True,
        on_delete=models.CASCADE, related_name="owned_facilities"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                name="facility_exactly_one_parent",
                check=(
                    (Q(organization__isnull=False) & Q(owner__isnull=True)) |
                    (Q(organization__isnull=True) & Q(owner__isnull=False))
                ),
            )
        ]
    @property
    def is_organization(self) -> bool:
        return self.organization_id is not None
    


class OrganizationMembership(models.Model):
    class OrgRole(models.TextChoices):
        USER = "user", "User"
        LEADER = "leader", "Leader"

    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="Organization_membership")
    organization = models.ForeignKey(Organization,on_delete=models.CASCADE,related_name="memberships")
    role = models.CharField(max_length=10,choices=OrgRole.choices,default=OrgRole.USER)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "organization"], name="uniq_user_org")
        ]


    
class Wallet(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='user_wallet')
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)
    points = models.IntegerField(default = 0)
    updated_at = models.DateField(auto_now=True)
    class Meta:
        constraints = [UniqueConstraint(fields=['user','facility'], name='uniq_wallet')]

class Sendcode(models.Model):
    email = models.EmailField()
    code = models.CharField(max_length=5)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=10)  

class Rooms(models.Model):
    name = models.CharField(max_length=50, blank=True, null=True)
    is_organization = models.BooleanField(default=False)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name="rooms", 
                                #  unique=True,
                                 blank=True, null=True)
    organization = models.ForeignKey(
        Organization, null=True, blank=True, on_delete=models.CASCADE, related_name="rooms"
    )
    created_at = models.DateTimeField(auto_now_add=True)



    def __str__(self):
        # return str(self.number)
        return str(self.name)
    
class FacilityMembership(models.Model):
    class FacilityRole(models.TextChoices):
        USER = "user", "User"
        LEADER = "leader", "Leader"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="facility_memberships")
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name="memberships")
    role = models.CharField(max_length=10, choices=FacilityRole.choices, default=FacilityRole.USER)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "facility"], name="uniq_user_facility")
        ]

class Report(models.Model):
    REPORT_TYPES = [
        ('computer', 'Computer is broken'),
        ('light', 'Light Issue'),
        ('water','Water/plumbing'),
        ('internet','Wifi/Internet'),
        ('heating','Heating/Cooling'),
        ('other', 'Other'),
    ]
    STATUS_TYPES = [
        ('pending','Pending'),
        ('resolved','Resolved'),
        ('urgent','Urgent')
    ]
    room = models.ForeignKey(Rooms, related_name='reports', on_delete=models.CASCADE)
    report_type = models.CharField(max_length=50, choices=REPORT_TYPES)
    description = models.TextField(max_length=250)
    status = models.CharField(max_length=50,choices=STATUS_TYPES,default='Pending')
    attachment = models.FileField(upload_to='documents/',null=True,blank=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='reports', null=True, blank=True)
    user_name = models.CharField(max_length=25)
    report_date = models.DateTimeField(auto_now_add=True)
    is_private = models.BooleanField(default=False)
    facility = models.ForeignKey(Facility,on_delete=models.CASCADE)
    def save(self, *args, **kwargs):
        if not self.pk and self.user:
            self.user.points = (self.user.points or 0) +1 
            self.user.save()
        super().save(*args, **kwargs)

class Product(models.Model):
    name = models.CharField(max_length = 50, unique = True, blank=True, null=True)
    label = models.CharField(max_length=100, blank=True, null=True)
    price = models.IntegerField(default = 0)

    def __str__(self):
        return self.label
    
class Redeem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    redeem_date = models.DateTimeField(auto_now_add=True)
    code = models.CharField(default = 0)






