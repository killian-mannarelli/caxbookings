from rest_framework import serializers
from .models import Computers
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
        fields = ('id', 'user', 'computer', 'start', 'end')

class RoomsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rooms
        fields = ('id', 'name')

class CreateBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookings
        fields = ('computer', 'start', 'end')
        
class SearchUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('id', 'username', 'admin_level')