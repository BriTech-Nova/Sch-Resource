from rest_framework import generics, permissions
from rest_framework.response import Response
from django.db.models import Count, Sum
from users.models import User
from resources.models import ResourceRequest
from labs.models import LabBooking
from store.models import InventoryItem
from library.models import Book

class AdminStatsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.role == 'admin':
            return Response({"detail": "Not authorized"}, status=403)
        
        stats = {
            'users': {
                'total': User.objects.count(),
                'by_role': dict(User.objects.values_list('role').annotate(count=Count('role')))
            },
            'resources': {
                'total_requests': ResourceRequest.objects.count(),
                'by_status': dict(ResourceRequest.objects.values_list('status').annotate(count=Count('status')))
            },
            'labs': {
                'total_bookings': LabBooking.objects.count(),
                'by_status': dict(LabBooking.objects.values_list('status').annotate(count=Count('status')))
            },
            'inventory': {
                'total_items': InventoryItem.objects.count(),
                'low_stock': InventoryItem.objects.filter(quantity__lte=models.F('threshold')).count(),
                'total_quantity': InventoryItem.objects.aggregate(total=Sum('quantity'))['total']
            },
            'library': {
                'total_books': Book.objects.count(),
                'total_copies': Book.objects.aggregate(total=Sum('total_copies'))['total'],
                'available_copies': Book.objects.aggregate(total=Sum('available_copies'))['total']
            }
        }
        return Response(stats)  