from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import UserListView, UserDetailView
from .serializers import CustomTokenObtainPairSerializer

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(serializer_class=CustomTokenObtainPairSerializer), name='token_obtain_pair'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]