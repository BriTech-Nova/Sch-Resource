from rest_framework import serializers
from .models import Lab, LabBooking
from users.serializers import UserSerializer

class LabSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lab
        fields = '__all__'

class LabBookingSerializer(serializers.ModelSerializer):
    lab = LabSerializer(read_only=True)
    teacher = UserSerializer(read_only=True)
    
    class Meta:
        model = LabBooking
        fields = '__all__'
        read_only_fields = ['created_at']