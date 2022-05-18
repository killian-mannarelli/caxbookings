from rest_framework import serializers
from .models import ComputerInRoom, Computers, GlobalVariables, RoomSearch, UserInfos, RoomBooked
from .models import Bookings
from .models import Rooms
from django.contrib.auth.models import User


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
        fields = ('computer_id', 'computer_status', 'computer_name', 'room_id', 'next_booking_time')

class GlobalVariablesSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalVariables
        fields = ('name','value')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'is_superuser', "is_staff")


class RoomSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomSearch
        fields = ('room_id', 'room_name' , 'room_capacity','room_current_capacity')

class RoomBookedSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomBooked
        fields = ('room_id', 'room_name' , 'room_booking_count')



class UserInfosSerialiser(serializers.ModelSerializer):
    class Meta:
        model = UserInfos
        fields = ('user_id', 'username', 'is_superuser', 'is_staff',
                  'nb_in_process_bookings', 'nb_total_bookings', 'nb_canceled_bookings', 'nb_passed_bookings', 'avg_booking_time')
