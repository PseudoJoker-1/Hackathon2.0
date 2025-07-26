from django import forms
from .models import Report

class ReportForm(forms.ModelForm):
    class Meta:
        model = Report
        fields = ['report_type', 'description']
        labels = {
            'report_type': 'Type',
            'description': 'Describe the Issue'
        }
