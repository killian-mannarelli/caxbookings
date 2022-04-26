from rest_framework import serializers
from .models import ComputerInRoom, Computers
from .models import Bookings




class ComputerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Computers
        fields = ('id', 'status', 'name', 'room')
        

class BookingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookings
        fields = ('id', 'user', 'computer', 'start', 'end')

class CreateBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookings
        fields = ('computer', 'start', 'end')

class ComputerInRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComputerInRoom
        fields = ('computer_id', 'computer_status', 'computer_name', 'room_id')