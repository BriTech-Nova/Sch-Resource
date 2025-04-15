from rest_framework import generics, permissions
from .models import Lab, LabBooking
from .serializers import LabSerializer, LabBookingSerializer
from django_filters.rest_framework import DjangoFilterBackend

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

class LabBookingRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LabBooking.objects.all()
    serializer_class = LabBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

class RecentLabBookingsView(generics.ListAPIView):
    serializer_class = LabBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LabBooking.objects.order_by('-created_at')[:10]