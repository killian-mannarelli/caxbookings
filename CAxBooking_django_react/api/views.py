from django.shortcuts import redirect, render

# Create your views here.
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import BookingsSerializer, ComputerSerializer, CreateBookingSerializer

from .models import Bookings, Computers
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





    
   

    
    


   

    



    