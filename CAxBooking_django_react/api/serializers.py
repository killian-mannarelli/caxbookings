from rest_framework import serializers
from .models import ComputerInRoom, Computers, RoomSearch
from .models import Bookings
from .models import Rooms
from .models import Users




class ComputerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Computers
        fields = ('id', 'status', 'name', 'room')
        

class BookingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookings
        fields = ('id', 'user_id', 'computer', 'start', 'end', 'status')

class RoomsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rooms
        fields = ('id', 'name')

class CreateBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookings
        fields = ('computer', 'start', 'end')

class ComputerInRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComputerInRoom
        fields = ('computer_id', 'computer_status', 'computer_name', 'room_id')
        
class SearchUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('id', 'username', 'admin_level')

class RoomSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomSearch
        fields = ('room_id', 'room_name' , 'room_capacity','room_current_capacity')
