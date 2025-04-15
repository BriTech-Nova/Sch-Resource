from django.db import models

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

    def __str__(self):
        return f"{self.title} by {self.author}"

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

    def __str__(self):
        return f"{self.book.title} borrowed by {self.borrower_name}"