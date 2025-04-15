from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.serializers import CustomTokenObtainPairSerializer
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({"message": "Welcome to the School Resource Management API!"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/resources/', include('resources.urls')),
    path('api/labs/', include('labs.urls')),
    path('api/store/', include('store.urls')),
    path('api/library/', include('library.urls')),
    path('api/admin/', include('admin_dashboard.urls')),
    path('api/token/', TokenObtainPairView.as_view(serializer_class=CustomTokenObtainPairSerializer), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', api_root, name='api_root'), #welcome screen for the API
]