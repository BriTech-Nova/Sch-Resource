from django.urls import path
from .views import (
    InventoryListCreateView,
    InventoryRetrieveUpdateDestroyView,
    LowStockItemsView
)

urlpatterns = [
    path('', InventoryListCreateView.as_view(), name='inventory-list'),
    path('<int:pk>/', InventoryRetrieveUpdateDestroyView.as_view(), name='inventory-detail'),
    path('low-stock/', LowStockItemsView.as_view(), name='low-stock-items'),
]