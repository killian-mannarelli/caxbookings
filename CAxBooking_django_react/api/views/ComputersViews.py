from datetime import datetime
import json
from django.http import JsonResponse
from django.shortcuts import redirect
from dateutil import parser
from django.db.models import Q, Min
from pytz import timezone
from rest_framework import generics
from ..serializers import *
from ..models import Bookings, ComputerInRoom, Computers
from dateutil.relativedelta import relativedelta
# Create your views here.

# region computers


class ComputerListView(generics.ListAPIView):
    queryset = Computers.objects.all()
    serializer_class = ComputerSerializer

    def get(self, request, *args, **kwargs):
        """
        If the user is authenticated, then show the list of objects, otherwise redirect to the login page

        :param request: The full HTTP request object for this page
        :return: The list of all the questions in the database.
        """
        if(request.user.is_authenticated):
            return self.list(request, *args, **kwargs)
        else:
            return redirect('/login')


class ComputerModifyView(generics.ListAPIView):

    queryset = Computers.objects.all()
    serializer_class = ComputerSerializer

    def post(self, request, format=None):
        """
        It takes a computer id and a new name, and changes the name of the computer with that id to the new
        name

        :param request: The request object that is passed to the view
        :param format: The format of the response
        :return: A JsonResponse object is being returned.
        """
        computer_id = request.data['computer_id']
        new_name = request.data['computer_name']
        new_host_name = request.data['computer_host_name']
        computer = Computers.objects.get(id=computer_id)
        if(computer is None):
            return JsonResponse({"error": "Computer does not exist"})
        computer.name = new_name
        computer.host_name = new_host_name
        computer.save()
        return JsonResponse({"success": "Computer name changed"})


class ComputerSearchView(generics.ListAPIView):
    model = Computers
    serializer_class = ComputerSerializer

    def get_queryset(self):
        """
        If the user has specified a computer_id, return only the computer with that id. If the user has
        specified a room_id, return all computers in that room. If the user has specified neither,
        return all computers
        :return: The queryset is being returned.
        """
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
        """
        It takes a room_id and a time_span_start and time_span_end as parameters and returns a list of
        ComputerInRoom objects that have the computer_id, computer_name, room_id, computer_status and
        next_booking_time of each computer in the room
        :return: A list of ComputerInRoom objects
        """
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

                    date = parser.parse(time_span_start)

                    start = date - \
                        relativedelta(days=date.weekday())

                    end = start + relativedelta(days=6)
                    bookings = Bookings.objects.filter(
                        Q(status=1) | Q(status=2), computer=computer.id, start__gte=date, end__lte=end).order_by('start')

                    if bookings.count() > 0:
                        nextBooking = bookings[0]
                        next_booking_time = nextBooking.start
                        next_booking_duration = nextBooking.end - nextBooking.start
                        print(next_booking_duration)
                    else:
                        next_booking_time = None
                        next_booking_duration = None

                    computerInRoomI = ComputerInRoom(
                        computer_id=computer.id, computer_name=computer.name,  room_id=computer.room.id, computer_status=0,
                        next_booking_time=next_booking_time, next_booking_duration=next_booking_duration
                    )

                    # search for bookings for that computer in that time span
                    # print("parsering time span")
                    # print(parser.parse(time_span_start))
                    for(booking) in bookings:
                        if(booking.start >= parser.parse(time_span_start) and booking.end <= parser.parse(time_span_end)):
                            computerInRoomI.computer_status = 1
                        elif(booking.start <= parser.parse(time_span_start) and booking.end >= parser.parse(time_span_start)):
                            computerInRoomI.computer_status = 1
                        elif(booking.start <= parser.parse(time_span_start) and booking.end >= parser.parse(time_span_end)):
                            computerInRoomI.computer_status = 1
                        elif(booking.start >= parser.parse(time_span_start) and booking.start <= parser.parse(time_span_end) and booking.end >= parser.parse(time_span_end)):
                            computerInRoomI.computer_status = 1

                    listtoreturn.append(computerInRoomI)
        return listtoreturn


def get_next_booking(request):
    """
    It gets the next booking for a computer, and returns the time of the booking

    :param request: The request object
    :return: The next booking for the computer
    """
    if request.method == 'POST':
        json_body = request.body.decode('utf-8')
        json_body = json.loads(json_body)
        host_name = json_body['host_name']
        computer = Computers.objects.get(host_name=host_name)
        bookings = Bookings.objects.filter(
            Q(status=1) | Q(status=2), computer=computer.id, start__gte=datetime.now(), start__day=datetime.now().day, start__month=datetime.now().month, start__year=datetime.now().year)
        bookings.order_by('start')

        if bookings.count() > 0:
            # Formatting the time to be in the format HH:MM
            minutes_start = bookings[0].start.minute
            minutes_end = bookings[0].end.minute
            if minutes_start < 10:
                minutes_start = f"0{minutes_start}"
            if minutes_end < 10:
                minutes_end = f"0{minutes_end}"
            time_start = (f"{bookings[0].start.hour}:{minutes_start}")
            time_end = (f"{bookings[0].start.hour}:{minutes_end}")
            return JsonResponse({"next_booking_start": time_start, "next_booking_end": time_end, "PC_name":computer.name })

        return JsonResponse({'next_booking': "none"})


def add_pc_in_room(request):
    """
    It takes a POST request with a JSON body containing a room_id and a pc_name, and adds a new computer
    to the database with the given name and room

    :param request: The request object that Django uses to represent and manage an HTTP request
    :return: A JsonResponse object.
    """
    if request.method == 'POST':
        json_body = request.body.decode('utf-8')
        json_body = json.loads(json_body)
        room_id = json_body['room_id'][0]
        pc_name = json_body['pc_name']
        host_name = json_body['pc_host_name']
        if room_id is not None and pc_name is not None:
            room = Rooms.objects.get(id=room_id)
            pc = Computers(name=pc_name, room=room, host_name=host_name)
            pc.save()
            return JsonResponse({'status': 'success'})
        return JsonResponse({'status': 'error'})


def delete_room_computer(request):
    """
    It deletes a computer from the database and all the bookings related to this computer

    :param request: The request object is an HttpRequest object. It contains metadata about the request,
    such as the HTTP method
    :return: A JsonResponse with a status of success or error.
    """
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
