from django.urls import path
from .views import (
    LabListCreateView,
    AvailableLabsView,
    LabBookingListCreateView,
    LabBookingRetrieveUpdateDestroyView,
    RecentLabBookingsView
)

urlpatterns = [
    path('', LabListCreateView.as_view(), name='lab-list'),
    path('available/', AvailableLabsView.as_view(), name='available-labs'),
    path('bookings/', LabBookingListCreateView.as_view(), name='lab-booking-list'),
    path('bookings/<int:pk>/', LabBookingRetrieveUpdateDestroyView.as_view(), name='lab-booking-detail'),
    path('bookings/recent/', RecentLabBookingsView.as_view(), name='recent-lab-bookings'),
]