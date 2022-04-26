from pyexpat import model
from django.shortcuts import redirect, render
from dateutil import parser

# Create your views here.
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import BookingsSerializer, ComputerInRoomSerializer, ComputerSerializer, CreateBookingSerializer

from .models import Bookings, ComputerInRoom, Computers, Rooms
# Create your views here.
 



class ComputerListView(generics.ListAPIView):
    #check if the user is authenticated
    #if not redirect to login page
    #if authenticated then return the list of computers
    queryset = Computers.objects.all()
    serializer_class = ComputerSerializer
    def get(self, request, *args, **kwargs):
        if(request.user.is_authenticated):
            return self.list(request, *args, **kwargs)
        else:
            return redirect('/login')


class ComputerSearchView(generics.ListAPIView):
    model = Computers
    serializer_class = ComputerSerializer
    #check if the user is authenticated
    #if not redirect to login page
    #if authenticated then return the list of computers



    def get_queryset(self):
        queryset = Computers.objects.all()
        id = self.request.query_params.get('computer_id')
        roomid = self.request.query_params.get('room_id')
        if(not self.request.user.is_authenticated):
            return redirect('/login')

        if id is not None:
            queryset = queryset.filter(id=id)
        if roomid is not None:
            queryset = queryset.filter(room=roomid)
        return queryset

class RoomsSearchView(generics.ListAPIView):
    model = Rooms
    serializer_class = ComputerSerializer
    
    def get_queryset(self):
        queryset = Rooms.objects.all()
        id = self.request.query_params.get('room_id')
        if id is not None:
            queryset = queryset.filter(id=id)
        return queryset         

class BookingSearchView(generics.ListAPIView):
    model = Bookings
    serializer_class = BookingsSerializer 
    def get_queryset(self):
        queryset = Bookings.objects.all()
        id = self.request.query_params.get('book_id')
        userId = self.request.query_params.get('user_id')
        if id is not None:
            queryset = queryset.filter(id=id)
        if userId is not None:
            queryset = queryset.filter(user=userId)
        return queryset
        
class BookingsCreateView(APIView):
    serializer_class = CreateBookingSerializer
    def post(self, request, format = None):
        if(self.request.user.is_authenticated):
            serializer = self.serializer_class(request.data)
            if(serializer.is_valid()):
                computer = serializer.data.computer
                start = serializer.data.start
                end = serializer.data.end
                user = self.request.user
                booking = Bookings(user=user,computer=computer, start=start, end=end)
                booking.save()
                return Response(BookingsSerializer(booking).data,status=status.HTTP_201_CREATED)

class BookingsListView(generics.ListAPIView):
    queryset = Bookings.objects.all()
    serializer_class = BookingsSerializer


class ComputerInRoomListView(generics.ListAPIView):
    model = ComputerInRoom
    serializer_class = ComputerInRoomSerializer
    def get_queryset(self):
        queryset = Computers.objects.all()
        listtoreturn = []
        room_id = self.request.query_params.get('room_id')
        time_span_start = self.request.query_params.get('time_span_start')
        time_span_end = self.request.query_params.get('time_span_end')
        if room_id is not None:
            queryset = queryset.filter(room=room_id)
            if time_span_start is not None and time_span_end is not None:
                for (computer) in queryset:
                    #create a ComputerInRoom object for each computer in the room
                    #search in Bookings if there is one for that computer in that time span
                    #if there is one then set the status to 1
                    #else set the status to 0
                    computerInRoomI = ComputerInRoom(computer_id = computer.id, computer_name=computer.name, room_id=computer.room.id, computer_status=0)
                    #search for bookings for that computer in that time span
                    bookings = Bookings.objects.filter(computer=computer.id, start__gte=parser.parse(time_span_start), end__lt=parser.parse(time_span_end))
                    if(bookings.count() > 0):
                        computerInRoomI.computer_status = 1
                    listtoreturn.append(computerInRoomI)
                    


        return listtoreturn
    





    
   

    
    


   

    



    