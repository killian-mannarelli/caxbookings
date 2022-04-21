

from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from rest_framework import generics, status
from .serializers import ComputerSerializer

from .models import Computers
# Create your views here.




class ComputerListView(generics.ListAPIView):
    model = Computers
    serializer_class = ComputerSerializer
    queryset = Computers.objects.all()


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
            



    
   

    
    


   

    



    