
import json
from pyexpat import model
from django.http import JsonResponse
from dateutil import parser
from django.db.models import Q
from rest_framework import generics, viewsets
from ..serializers import *
from ..models import Bookings, Computers, RoomSearch, Rooms

# region rooms


class SpecificRoomsSearch(generics.ListAPIView):
    model = Rooms
    serializer_class = RoomsSerializer

    """
    > If the user has specified a room_id in the query string, filter the queryset to only include rooms
    with that id
    :return: The queryset is being returned.
    """
    def get_queryset(self):
        queryset = Rooms.objects.all()
        id = self.request.query_params.get('room_id')
        if id is not None:
            queryset = queryset.filter(id=id)
        return queryset


class MostBookedRoomsSearch(generics.ListAPIView):
    model = RoomBooked
    serializer_class = RoomBookedSerializer


    #take all the rooms in the DB, and for each room, find the number of bookings
    # return the room in ascending order of the number of bookings
    def get_queryset(self):
        queryset = Rooms.objects.all()
        listtoreturn = []
        for room in queryset:
            roomBooked = RoomBooked(room_id=room.id, room_name=room.name, room_booking_count=0)
            computers = Computers.objects.filter(room=room.id)
            bookings = Bookings.objects.filter(computer__in=computers)
            roomBooked.room_booking_count = len(bookings)
            listtoreturn.append(roomBooked)
        listtoreturn = sorted(listtoreturn, key=lambda x: x.room_booking_count, reverse=True)
        return listtoreturn



#create a viewset for ROoms
class RoomsViewSet(generics.ListAPIView):
    queryset = Rooms.objects.all()
    serializer_class = RoomsSerializer
    def post(self, request, format=None):
        """
        It takes a room_id and a new_name, and changes the name of the room with the given room_id to the
        new_name
        
        :param request: The request object that is passed to the view
        :param format: The format of the response
        :return: A JsonResponse object is being returned.
        """
        room_id = request.data['room_id']
        new_name = request.data['room_name']
        room = Rooms.objects.get(id=room_id)
        if(room is None):
            return JsonResponse({"error": "Room does not exist"})
        room.name = new_name
        room.save()
        return JsonResponse({"success": "Room name changed"})



class RoomsSearchView(generics.ListAPIView):
    model = RoomSearch
    serializer_class = RoomSearchSerializer

    def get_queryset(self):
        """
        It takes in a room id, a start time, and an end time, and returns a list of RoomSearch objects,
        which contain the room id, room name, room capacity, and room current capacity
        :return: A list of RoomSearch objects
        """
        queryset = Rooms.objects.all()
        id = self.request.query_params.get('room_id')
        timestart = self.request.query_params.get('time_start')
        timeend = self.request.query_params.get('time_end')

        listtoreturn = []
        if id is not None:
            queryset = queryset.filter(id=id)
            RoomSearchI = RoomSearch(room_id=id, room_name=queryset[0].name)
            if timestart is not None and timeend is not None:
                RoomSearchI = RoomSearch(room_id=id, room_name=queryset[0].name, room_capacity=get_room_capacity(
                    id), room_current_capacity=get_room_current_capacity(id, parser.parse(timestart), parser.parse(timeend)))
                listtoreturn.append(RoomSearchI)
                return listtoreturn

        for (i) in queryset:
            RoomSearchI = RoomSearch(room_id=i.id, room_name=i.name, room_capacity=get_room_capacity(
                i.id), room_current_capacity=get_room_current_capacity(i.id, parser.parse(timestart), parser.parse(timeend)))
            listtoreturn.append(RoomSearchI)
        return listtoreturn


def get_room_current_capacity(room_id, time_start, time_end):
    """
    It returns the number of computers that are not in a booking during the timespan
    
    :param room_id: The id of the room you want to check
    :param time_start: The start time of the booking
    :param time_end: The end time of the booking
    :return: The number of computers that are not in a booking during this timespan
    """
    # A method that counts the number of computer that are not in a booking during this timespan and return the number of computer
    computers = Computers.objects.filter(room=room_id)
    computers_in_booking = []
    for computer in computers:
        bookings = Bookings.objects.filter(Q(start__gte=time_start) | Q(
            end__lte=time_end), Q(status=1) | Q(status=2), computer=computer.id)
        for(booking) in bookings:
            if(booking.start >= time_start and booking.end <= time_end):
                computers_in_booking.append(computer)
                continue
            if(booking.start <= time_start and booking.end >= time_start):
                computers_in_booking.append(computer)
                continue
            if(booking.start >= time_start and booking.start <= time_end and booking.end >= time_end):
                computers_in_booking.append(computer)
                continue

    return len(computers) - len(computers_in_booking)


def get_room_capacity(room_id):
    """
    > This function takes in a room id and returns the number of computers in that room
    
    :param room_id: The id of the room
    :return: The number of computers in a room
    """
    # A method that counts the number of computer that have this room id and return the number of computers
    computers = Computers.objects.filter(room=room_id)
    return len(computers)


def add_room(request):
    """
    It takes the request body, decodes it, loads it into a json object, and then saves it to the
    database
    
    :param request: The request object is a Python object that contains all the information about the
    request that was sent to the server
    :return: a JsonResponse object.
    """
    # take the same model as the one used in the add_bookings
    if request.method == 'POST':
        json_body = request.body.decode('utf-8')
        json_body = json.loads(json_body)
        print(json_body)
        roomname = json_body['room_name']
        if roomname is not None:
            roomtoAdd = Rooms(name=roomname)
            roomtoAdd.save()
            return JsonResponse({'status': 'success'})
        return JsonResponse({'status': 'error'})


def delete_room(request):
    """
    It deletes a room and all the computers and bookings related to it.
    
    :param request: The request object is a Python object that contains all the information about the
    request that was made to the server
    :return: A list of all the rooms in the database
    """
    if request.method == 'POST':
        json_body = request.body.decode('utf-8')
        json_body = json.loads(json_body)
        print(json_body)
        room_id = json_body['room_id']

        if room_id is not None:
            for id in room_id:
                roomtoDelete = Rooms.objects.get(id=id)
                # find all the computers in this room
                # find all the bookings related to each computer of the room (for loop)
                # delete every bookings related to this computer then delete the computer
                computers = Computers.objects.filter(room=id)
                for computer in computers:
                    bookings = Bookings.objects.filter(computer=computer)
                    for booking in bookings:
                        booking.delete()
                    computer.delete()

                roomtoDelete.delete()

            return JsonResponse({'status': 'success'})
        return JsonResponse({'status': 'error'})

# endregion

