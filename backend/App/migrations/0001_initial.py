# Generated by Django 5.2.3 on 2025-07-22 20:25

import django.contrib.auth.models
import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('vacation_start_date', models.DateField()),
                ('vacation_end_date', models.DateField()),
                ('create_date', models.DateField(auto_now_add=True)),
                ('attached_file', models.FileField(blank=True, null=True, upload_to='document/')),
                ('signature', models.TextField(blank=True, null=True)),
                ('signed_at', models.DateTimeField(blank=True, null=True)),
                ('doc_type', models.CharField(choices=[('statement', 'Заявление'), ('explanatory_note', 'Объяснительная'), ('travel_assignment', 'Командировка'), ('act', 'Акт'), ('order', 'Приказ'), ('protocol', 'Протокол'), ('reference', 'Справка'), ('vacation', 'Отпуск')], max_length=30)),
                ('status', models.CharField(choices=[('draft', 'Черновик'), ('waiting', 'Ожидает'), ('approved', 'Одобрено'), ('rejected', 'Отклонено')], default='draft', max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Attachment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(blank=True, null=True, upload_to='document/')),
                ('uploaded_at', models.DateTimeField(auto_now=True, null=True)),
                ('comment', models.TextField(blank=True, max_length=255, null=True)),
                ('document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='App.document')),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('FIO', models.CharField(blank=True, max_length=255, null=True)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('role', models.CharField(choices=[('worker', 'Сотрудник'), ('accountant', 'Бухгалтер'), ('hr', 'Управляющий'), ('president', 'Президент')], max_length=20)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='DocumentHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action', models.CharField(max_length=190)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('comment', models.TextField(blank=True, null=True)),
                ('document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='history', to='App.document')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='document',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='ApprovalStep',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.IntegerField(blank=True, null=True)),
                ('status', models.CharField(choices=[('waiting', 'Ожидает'), ('approved', 'Подписано'), ('rejected', 'Отклонено')], default='waiting', max_length=20)),
                ('approved_at', models.DateTimeField(blank=True, null=True)),
                ('comment', models.TextField(blank=True, max_length=255, null=True)),
                ('document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='App.document')),
                ('approver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
