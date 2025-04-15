from rest_framework import serializers
from .models import ResourceRequest
from users.serializers import UserSerializer

class ResourceRequestSerializer(serializers.ModelSerializer):
    teacher = UserSerializer(read_only=True)
    
    class Meta:
        model = ResourceRequest
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']