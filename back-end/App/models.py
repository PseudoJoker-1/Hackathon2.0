from django.db import models
from django.urls import reverse
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.contrib.auth.models import BaseUserManager
from django.utils import timezone
from datetime import timedelta



class User(AbstractUser):
    ROLE_CHOICES = [
        ('worker','Сотрудник'),
        ('accountant','Бухгалтер'),
        ('hr','Управляющий'),
        ('president','Президент')
        
    ]
    FIO = models.CharField(max_length=255,blank=True,null=True)
    email = models.EmailField(unique=True,blank=True,null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    social_score = models.IntegerField(default=0, blank=True, null=True)
    is_admin = models.BooleanField(default=False)
    vacation_days_left = models.IntegerField(default=2, blank=True, null=True)
    points = models.IntegerField(default = 0)
    
class Sendcode(models.Model):
    email = models.EmailField()
    code = models.CharField(max_length=5)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=10)


class Document(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    vacation_start_date = models.DateField()
    vacation_end_date = models.DateField()
    create_date = models.DateField(auto_now_add=True)
    attached_file = models.FileField(upload_to='document/',blank=True,null=True)
    signature = models.TextField(blank=True, null=True)  # base64-подпись
    signed_at = models.DateTimeField(blank=True, null=True)
    

    STATUS_CHOICES = [
        ('draft', 'Черновик'),
        ('waiting', 'Ожидает'),
        ('approved', 'Одобрено'),
        ('rejected', 'Отклонено'),
    ]
    DOC_CHOICES = [
        ('statement', 'Заявление'),
        ('explanatory_note', 'Объяснительная'),
        ('travel_assignment', 'Командировка'),
        ('act', 'Акт'),
        ('order', 'Приказ'),
        ('protocol', 'Протокол'),
        ('reference', 'Справка'),
        ('vacation', 'Отпуск'),
    ]
    doc_type = models.CharField(max_length=30, choices=DOC_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    @property
    def vacation_days(self):
        if self.vacation_start_date and self.vacation_end_date:
            return (self.vacation_end_date - self.vacation_start_date).days + 1
        return 0
    
    def __str__(self):
        return f"{self.author} ({self.doc_type})"
    
class DocumentHistory(models.Model):
    document = models.ForeignKey(Document,on_delete=models.CASCADE,related_name='history')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    action = models.CharField(max_length=190)
    timestamp = models.DateTimeField(auto_now_add=True)
    comment = models.TextField(blank=True,null=True)

    def __str__(self):
        return f"{self.user} - {self.action} - {self.timestamp} - {self.comment}"
    
class ApprovalStep(models.Model):
    STATUS_CHOICES = [
        ('waiting', 'Ожидает'),
        ('approved', 'Подписано'),
        ('rejected', 'Отклонено'),
    ]

    document = models.ForeignKey(Document,on_delete=models.CASCADE,related_name='approval_steps')
    approver = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    order = models.IntegerField(blank=True,null=True)
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default='waiting')
    approved_at = models.DateTimeField(blank=True,null=True)
    comment = models.TextField(max_length=255,blank=True,null=True)
    def __str__(self):
        return f"{self.document} ({self.approver}), {self.order}, {self.status}, {self.approved_at},{self.comment}"


class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user} - {self.document} - {self.message[:20]} - {'Read' if self.is_read else 'Unread'}"
    

    def get_absolute_url(self):
        return reverse('notification_detail', kwargs={'pk': self.pk})
    def mark_as_read(self):
        self.is_read = True
        self.save()
    def mark_as_unread(self):
        self.is_read = False
        self.save()
    def get_document_url(self):
        return reverse('document_detail', kwargs={'pk': self.document.pk})
    def get_user_url(self):
        return reverse('user_detail', kwargs={'pk': self.user.pk})
    def get_notification_url(self):
        return reverse('notification_detail', kwargs={'pk': self.pk})
    def get_notification_list_url(self):
        return reverse('notification_list')
    def get_document_list_url(self):
        return reverse('document_list')
    def get_user_list_url(self):
        return reverse('user_list')
    
class ScoreTransaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='score_transactions')
    points = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def str(self):
        return f"{self.user} - {self.points} points - {self.description[:20]} - {self.created_at}"

    class Meta:
        ordering = ['-created_at']

class Rooms(models.Model):
    number = models.IntegerField(unique=True)

    def __str__(self):
        return str(self.number)

class Report(models.Model):
    REPORT_TYPES = [
        ('computer', 'Computer is broken'),
        ('light', 'Light Issue'),
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






