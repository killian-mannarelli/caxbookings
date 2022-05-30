from rest_framework import serializers
from .models import ComputerInRoom, Computers, EquipmentInRoom, GlobalVariables, RoomEquipment, RoomSearch, RoomWithEquipmentName, UserInfos, RoomBooked
from .models import Bookings
from .models import Rooms
from django.contrib.auth.models import User


# This class is a serializer for the Computers model. It will serialize the id, status, name, and room
# fields
class ComputerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Computers
        fields = ('id', 'status', 'name', 'room', 'host_name')


# This class is a serializer for the Bookings model. It will be used to serialize the Bookings model
# into JSON.
class BookingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookings
        fields = ('id', 'user_id', 'computer', 'start', 'end', 'status')


# This is a serializer for the Rooms model, and it's going to serialize the id and name fields.
class RoomsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rooms
        fields = ('id', 'name')


# This class is a serializer for the Bookings model, and it's fields are computer, start, and end.
class CreateBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookings
        fields = ('computer', 'start', 'end')


# This class is used to serialize the ComputerInRoom model
class ComputerInRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComputerInRoom
        fields = ('computer_id', 'computer_status',
                  'computer_name', 'room_id', 'next_booking_time')

# This class is a serializer for the GlobalVariables model


class GlobalVariablesSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalVariables
        fields = ('name', 'value')


# "This is a serializer for the User model, and it should only serialize the id, username,
# is_superuser, and is_staff fields."
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'is_superuser', "is_staff")


# This class is a serializer for the RoomSearch model
class RoomSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomSearch
        fields = ('room_id', 'room_name', 'room_capacity',
                  'room_current_capacity')

# The RoomBookedSerializer class is a subclass of the ModelSerializer class. It defines the fields
# that will be serialized


class RoomBookedSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomBooked
        fields = ('room_id', 'room_name', 'room_booking_count')


class RoomEquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomEquipment
        fields = ('id', 'equipment_name')


class EquipmentInRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentInRoom
        fields = ('equipment_id', 'room_id')


# It's a serializer for the UserInfos model
class UserInfosSerialiser(serializers.ModelSerializer):
    class Meta:
        model = UserInfos
        fields = ('user_id', 'username', 'is_superuser', 'is_staff',
                  'nb_in_process_bookings', 'nb_total_bookings', 'nb_canceled_bookings', 'nb_passed_bookings', 'avg_booking_time')


class RoomWithEquipmentNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomWithEquipmentName
        fields = ('room_id', 'equipment_name')
