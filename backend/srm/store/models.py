from django.db import models

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

    def __str__(self):
        return f"{self.name} ({self.category})"