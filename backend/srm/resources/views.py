from rest_framework import generics, permissions
from .models import ResourceRequest
from .serializers import ResourceRequestSerializer
from django_filters.rest_framework import DjangoFilterBackend

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

class RecentResourceRequestsView(generics.ListAPIView):
    serializer_class = ResourceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ResourceRequest.objects.order_by('-created_at')[:10]