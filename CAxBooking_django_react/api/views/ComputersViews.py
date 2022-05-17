import json
from django.http import JsonResponse
from django.shortcuts import redirect
from dateutil import parser
from django.db.models import Q
from rest_framework import generics
from ..serializers import *
from ..models import Bookings, ComputerInRoom, Computers
# Create your views here.

# region computers
class ComputerListView(generics.ListAPIView):
    # check if the user is authenticated
    # if not redirect to login page
    # if authenticated then return the list of computers
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
    # check if the user is authenticated
    # if not redirect to login page
    # if authenticated then return the list of computers

    def get_queryset(self):
        queryset = Computers.objects.all()
        id = self.request.query_params.get('computer_id')
        roomid = self.request.query_params.get('room_id')
        if id is not None:
            queryset = queryset.filter(id=id)
        if roomid is not None:
            queryset = queryset.filter(room=roomid)
        return queryset


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
                    # create a ComputerInRoom object for each computer in the room
                    # search in Bookings if there is one for that computer in that time span
                    # if there is one then set the status to 1
                    # else set the status to 0
                    computerInRoomI = ComputerInRoom(
                        computer_id=computer.id, computer_name=computer.name, room_id=computer.room.id, computer_status=0)
                    # search for bookings for that computer in that time span
                    # print("parsering time span")
                    # print(parser.parse(time_span_start))
                    bookings = Bookings.objects.filter(Q(start__gte=parser.parse(time_span_start)) | Q(
                        end__lte=parser.parse(time_span_end)), Q(status=1) | Q(status=2), computer=computer.id)
                    for(booking) in bookings:
                        if(booking.start >= parser.parse(time_span_start) and booking.end <= parser.parse(time_span_end)):
                            computerInRoomI.computer_status = 1
                        elif(booking.start <= parser.parse(time_span_start) and booking.end >= parser.parse(time_span_start)):
                            computerInRoomI.computer_status = 1
                        elif(booking.start >= parser.parse(time_span_start) and booking.start <= parser.parse(time_span_end) and booking.end >= parser.parse(time_span_end)):
                            computerInRoomI.computer_status = 1

                    listtoreturn.append(computerInRoomI)
        return listtoreturn


def delete_room_computer(request):
    if request.method == 'POST':
        json_body = request.body.decode('utf-8')
        json_body = json.loads(json_body)
        print(json_body)
        computer_id = json_body['computer_id']
        if(computer_id is not None):
            computertoDelete = Computers.objects.get(id=computer_id)
            # find all the bookings related to this computer
            # delete every bookings related to this computer then delete the computer
            bookings = Bookings.objects.filter(computer=computer_id)
            for booking in bookings:
                booking.delete()
            computertoDelete.delete()
            return JsonResponse({'status': 'success'})
        return JsonResponse({'status': 'error'})


# endregion
