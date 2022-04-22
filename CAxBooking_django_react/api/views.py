

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
    
    def get_queryset(self):
        queryset = Computers.objects.all()
        id = self.request.query_params.get('computer_id')
        roomid = self.request.query_params.get('room_id')
        if id is not None:
            queryset = queryset.filter(id=id)
        if roomid is not None:
            queryset = queryset.filter(room=roomid)
        return queryset
            

class BookingsCreateView(APIView):
    serializer_class = CreateBookingSerializer
    def post(self, request, format = None):
        pass

class BookingsListView(generics.ListAPIView):
    queryset = Bookings.objects.all()
    serializer_class = BookingsSerializer





    
   

    
    


   

    



    