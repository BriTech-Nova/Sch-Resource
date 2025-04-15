from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import User, ResourceRequest, Lab, LabBooking, InventoryItem, Book, BorrowRecord
from .serializers import (
    UserSerializer, ResourceRequestSerializer, LabSerializer, 
    LabBookingSerializer, InventoryItemSerializer, BookSerializer, 
    BorrowRecordSerializer
)
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from datetime import timedelta

class ResourceRequestListCreateView(generics.ListCreateAPIView):
    queryset = ResourceRequest.objects.all()
    serializer_class = ResourceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'teacher']

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

class ResourceRequestRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ResourceRequest.objects.all()
    serializer_class = ResourceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

class LabListCreateView(generics.ListCreateAPIView):
    queryset = Lab.objects.all()
    serializer_class = LabSerializer
    permission_classes = [permissions.IsAuthenticated]

class AvailableLabsView(generics.ListAPIView):
    serializer_class = LabSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Lab.objects.filter(is_available=True)

class LabBookingListCreateView(generics.ListCreateAPIView):
    queryset = LabBooking.objects.all()
    serializer_class = LabBookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'teacher', 'lab']

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

class RecentLabBookingsView(generics.ListAPIView):
    serializer_class = LabBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LabBooking.objects.order_by('-created_at')[:10]

class LabBookingRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LabBooking.objects.all()
    serializer_class = LabBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

class InventoryListCreateView(generics.ListCreateAPIView):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    permission_classes = [permissions.IsAuthenticated]

class BookListCreateView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]

class BorrowRecordListCreateView(generics.ListCreateAPIView):
    queryset = BorrowRecord.objects.all()
    serializer_class = BorrowRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

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

class AdminStatsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.role == 'admin':
            return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
        
        stats = {
            'teachers': User.objects.filter(role='teacher').count(),
            'students': 0,  # Would be replaced with actual student count if implemented
            'books': Book.objects.count(),
            'labBookings': LabBooking.objects.count(),
            'inventoryItems': InventoryItem.objects.count(),
            'pendingRequests': ResourceRequest.objects.filter(status='pending').count(),
        }
        return Response(stats)