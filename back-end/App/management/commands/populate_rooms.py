from django.core.management.base import BaseCommand
from App.models import Rooms

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        if Rooms.objects.count() == 0:
            for r in range(100, 300, 10):
                Rooms.objects.create(number=r)