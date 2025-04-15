from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class ResourceRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('fulfilled', 'Fulfilled'),
        ('rejected', 'Rejected'),
    )
    teacher = models.ForeignKey(User, on_delete=models.CASCADE) 
    resource_type = models.CharField(max_length=100)
    resource_name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.resource_name} - {self.get_status_display()}"