

from django.shortcuts import redirect, render

# Create your views here.
from django.shortcuts import render
from rest_framework import generics, status
from .serializers import ComputerSerializer

from .models import Computers
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
            



    
   

    
    


   

    



    