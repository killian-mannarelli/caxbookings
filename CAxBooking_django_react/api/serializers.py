from rest_framework import serializers
from .models import Computers
from .models import Bookings




class ComputerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Computers
        fields = ('id', 'status', 'name', 'room')
        

class BookingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookings
        fields = ('id', 'user', 'computer', 'start', 'end')