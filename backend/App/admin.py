from django.contrib import admin
from .models import *

admin.site.register(Document)
admin.site.register(DocumentHistory)
admin.site.register(ApprovalStep)

