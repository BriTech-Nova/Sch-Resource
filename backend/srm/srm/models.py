from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    ROLES = (
        ('teacher', 'Teacher'),
        ('labtech', 'Lab Technician'),
        ('storekeeper', 'Storekeeper'),
        ('librarian', 'Librarian'),
        ('admin', 'Administrator'),
    )
    role = models.CharField(max_length=20, choices=ROLES)
    department = models.CharField(max_length=100, blank=True, null=True)

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

class Lab(models.Model):
    lab_number = models.CharField(max_length=20, unique=True)
    capacity = models.PositiveIntegerField()
    equipment = models.TextField(blank=True)
    is_available = models.BooleanField(default=True)

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

class InventoryItem(models.Model):
    CATEGORIES = (
        ('stationery', 'Stationery'),
        ('equipment', 'Equipment'),
        ('furniture', 'Furniture'),
        ('other', 'Other'),
    )
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORIES)
    quantity = models.PositiveIntegerField()
    threshold = models.PositiveIntegerField()
    department = models.CharField(max_length=100)
    last_restocked = models.DateTimeField(auto_now=True)

class Book(models.Model):
    CATEGORIES = (
        ('general', 'General'),
        ('fiction', 'Fiction'),
        ('non-fiction', 'Non-Fiction'),
        ('science', 'Science'),
        ('history', 'History'),
        ('reference', 'Reference'),
    )
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    isbn = models.CharField(max_length=20, unique=True)
    category = models.CharField(max_length=20, choices=CATEGORIES)
    total_copies = models.PositiveIntegerField()
    available_copies = models.PositiveIntegerField()
    added_date = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.pk:  # New book being added
            self.available_copies = self.total_copies
        super().save(*args, **kwargs)

class BorrowRecord(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    borrower_name = models.CharField(max_length=255)
    borrower_type = models.CharField(max_length=20, choices=(
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    ))
    borrowed_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField()
    returned = models.BooleanField(default=False)
    returned_date = models.DateTimeField(null=True, blank=True)