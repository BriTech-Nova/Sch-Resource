from rest_framework import generics, permissions, serializers
from .models import Book, BorrowRecord
from .serializers import BookSerializer, BorrowRecordSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

class BookListCreateView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']

class BookRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]

class BorrowRecordListCreateView(generics.ListCreateAPIView):
    queryset = BorrowRecord.objects.all()
    serializer_class = BorrowRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['borrower_name', 'returned']

    def perform_create(self, serializer):
        book = serializer.validated_data['book']
        if book.available_copies > 0:
            book.available_copies -= 1
            book.save()
            serializer.save()
        else:
            raise serializers.ValidationError("No available copies of this book")

class ReturnBookView(generics.UpdateAPIView):
    queryset = BorrowRecord.objects.all()
    serializer_class = BorrowRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.returned = True
        instance.returned_date = timezone.now()
        instance.save()
        
        # Update book availability
        book = instance.book
        book.available_copies += 1
        book.save()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class ActiveBorrowsView(generics.ListAPIView):
    serializer_class = BorrowRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BorrowRecord.objects.filter(returned=False)