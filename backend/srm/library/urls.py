from django.urls import path
from .views import (
    BookListCreateView,
    BookRetrieveUpdateDestroyView,
    BorrowRecordListCreateView,
    ReturnBookView,
    ActiveBorrowsView
)

urlpatterns = [
    path('books/', BookListCreateView.as_view(), name='book-list'),
    path('books/<int:pk>/', BookRetrieveUpdateDestroyView.as_view(), name='book-detail'),
    path('borrows/', BorrowRecordListCreateView.as_view(), name='borrow-list'),
    path('borrows/<int:pk>/return/', ReturnBookView.as_view(), name='return-book'),
    path('borrows/active/', ActiveBorrowsView.as_view(), name='active-borrows'),
]