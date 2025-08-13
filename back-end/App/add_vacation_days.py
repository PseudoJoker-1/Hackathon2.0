from django.core.management.base import BaseCommand
from App.models import User

class Command(BaseCommand):
    help = 'Add vacation days to all users'

    def handle(self, *args, **kwargs):
        users = User.objects.all()
        for user in users:
            user.vacation_days_left += 2
            user.save()
        self.stdout.write(self.style.SUCCESS('Successfully added vacation days to all users'))