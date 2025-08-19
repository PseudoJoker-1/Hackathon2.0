from django.db import models
from django.urls import reverse
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.contrib.auth.models import BaseUserManager
from django.utils import timezone
from datetime import timedelta
from django.db.models import UniqueConstraint


class Facility(models.Model):
    name = models.CharField(max_length=20,null=True,blank=True)
    members_num = models.IntegerField(default=1,null=True,blank=True)
  
class User(AbstractUser):
    ROLE_CHOICES = [
        ('user','Пользователь'),
        ('admin','Админ')  
    ]
    email = models.EmailField(unique=True,blank=True,null=True)
    facility = models.ForeignKey(Facility,on_delete=models.CASCADE,related_name="facility_membership", null=True, blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    points = models.IntegerField(default=0)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    is_admin = models.BooleanField(default=False)
    
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
    # name = models.CharField(max_length=50) # название комнаты (кухня, спальня и т.п.)
    name = models.CharField(max_length=50, blank=True, null=True)
    # number = models.IntegerField(unique=True)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name="rooms", 
                                #  unique=True,
                                 blank=True, null=True)

    def __str__(self):
        # return str(self.number)
        return str(self.name)

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






