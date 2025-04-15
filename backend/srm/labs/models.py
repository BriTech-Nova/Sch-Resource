from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL

class Lab(models.Model):
    lab_number = models.CharField(max_length=20, unique=True)
    capacity = models.PositiveIntegerField()
    equipment = models.TextField(blank=True)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"Lab {self.lab_number}"

class LabBooking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    requirements = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.lab} - {self.date} {self.start_time}-{self.end_time}"