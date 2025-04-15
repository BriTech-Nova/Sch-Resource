from django.urls import path
from .views import (
    ResourceRequestListCreateView,
    ResourceRequestRetrieveUpdateDestroyView,
    RecentResourceRequestsView
)

urlpatterns = [
    path('requests/', ResourceRequestListCreateView.as_view(), name='resource-request-list'),
    path('requests/<int:pk>/', ResourceRequestRetrieveUpdateDestroyView.as_view(), name='resource-request-detail'),
    path('requests/recent/', RecentResourceRequestsView.as_view(), name='recent-resource-requests'),
]