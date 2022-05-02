import json
from pyexpat import model
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from dateutil import parser

# Create your views here.
from django.shortcuts import render
from urllib3 import HTTPResponse
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import BookingsSerializer, ComputerInRoomSerializer, ComputerSerializer, CreateBookingSerializer, RoomsSerializer

from .models import Bookings, ComputerInRoom, Computers, Rooms, Users
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
        if id is not None:
            queryset = queryset.filter(id=id)
        if roomid is not None:
            queryset = queryset.filter(room=roomid)
        return queryset

class RoomsSearchView(generics.ListAPIView):
    model = Rooms
    serializer_class = RoomsSerializer
    
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

class OnGoingUserBookings(generics.ListAPIView):
    model = Bookings
    serializer_class = BookingsSerializer
    def get_queryset(self):
        queryset = Bookings.objects.all()
        user = Users.objects.get(username=self.request.user.username)
        
        if id is not None:
            queryset = queryset.filter(user=user.id)
            queryset = queryset.filter(status = 1)
        return queryset

def add_bookings(request):

        
    if request.method == 'POST':
        json_body = request.body.decode('utf-8')
        json_body = json.loads(json_body)
        print(json_body)
        computer = json_body['computer']
        start = json_body['start']
        end = json_body['end']
        if computer is not None and start is not None and end is not None:
            # get the Users related to the connected user username
            user = Users.objects.get(username=request.user.username)
            # get the Computer related to the computer_id
            computer = Computers.objects.get(id=computer)
            bookingtoAdd = Bookings(user=user, computer=computer, start=start, end=end, status=1)
            bookingtoAdd.save()
            return JsonResponse({'status': 'success'})
        return JsonResponse({'status': 'error'})
    
    
        
    

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
                    bookings = Bookings.objects.filter(computer=computer.id, start__gte=parser.parse(time_span_start), end__lte=parser.parse(time_span_end))
                    if(bookings.count() > 0):
                        computerInRoomI.computer_status = 1
                    listtoreturn.append(computerInRoomI)
                    


        return listtoreturn
    





    
   

    
    


   

    



    