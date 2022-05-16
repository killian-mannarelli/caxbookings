from datetime import datetime
import json
from pyexpat import model
from django.http import JsonResponse
from django.shortcuts import redirect
from dateutil import parser
from django.db.models import Q
from django.contrib.auth.models import User

# Create your views here.
from urllib3 import HTTPResponse
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
from django.db.models import Q
from .models import Bookings, ComputerInRoom, Computers, RoomSearch, Rooms, UserInfos, RoomBooked
# Create your views here.

# region users


class CurrentUserSearchView(generics.ListAPIView):
    model = User
    serializer_class = UserSerializer

    def get_queryset(self):
        if(self.request.user.is_authenticated):
            query = User.objects.all()
            query = query.filter(username=self.request.user.username)
            return query
        else:
            return None


class UserSearchView(generics.ListAPIView):
    model = User
    serializer_class = UserSerializer

    def get_queryset(self):
        if(self.request.user.is_staff or self.request.user.is_superuser):
            id = self.request.query_params.get('id')
            username = self.request.query_params.get('username')
            admin = self.request.query_params.get('admin_level')
            query = User.objects.all()
            if(id is not None):
                return query.filter(id=id)
            elif(username is not None):
                return query.filter(username=username)
            elif admin is not None:
                return query.filter(is_superuser=admin)
            return query
        else:
            return None


def delete_users(request):
    if request.method == 'POST':
        if(request.user.is_superuser):
            json_body = request.body.decode('utf-8')
            json_body = json.loads(json_body)
            print(json_body)
            user_id = json_body['user_id']

            if(user_id is not None):
                for id in user_id:
                    userToDelete = User.objects.get(id=id)
                    print(userToDelete.username)
                    # find all the bookings related to this computer
                    # delete every bookings related to this computer then delete the computer
                    bookings = Bookings.objects.filter(user=id)
                    for booking in bookings:
                        booking.delete()
                    userToDelete.delete()
                    return JsonResponse({'status': 'success'})
            return JsonResponse({'status': 'error'})


def delete_user(request):
    if request.method == 'POST':
        if(request.user.is_superuser):
            json_body = request.body.decode('utf-8')
            json_body = json.loads(json_body)
            print(json_body)
            user_id = json_body['user_id']

            if(user_id is not None):
                userToDelete = User.objects.get(id=user_id)
                print(userToDelete.username)
                # find all the bookings related to this computer
                # delete every bookings related to this computer then delete the computer
                bookings = Bookings.objects.filter(user=user_id)
                for booking in bookings:
                    booking.delete()
                userToDelete.delete()
                return JsonResponse({'status': 'success'})
            return JsonResponse({'status': 'error'})


def modify_user(request):
    if(request.user.is_superuser):
        if request.method == 'POST':
            json_body = request.body.decode('utf-8')
            json_body = json.loads(json_body)
            print(json_body)
            user_id = json_body['user_id']
            is_superuser = json_body['is_super']
            is_staff = json_body['is_staff']

            if(user_id is not None):
                userToModify = User.objects.get(id=user_id)
                print(userToModify.username)
                # find all the bookings related to this computer
                # delete every bookings related to this computer then delete the computer
                if is_superuser:
                    userToModify.is_superuser = not userToModify.is_superuser
                if is_staff:
                    userToModify.is_staff = not userToModify.is_staff
                userToModify.save()
                return JsonResponse({'status': 'success'})
            return JsonResponse({'status': 'error'})


class UserInfosView(generics.ListAPIView):
    model = UserInfos
    serializer_class = UserInfosSerialiser

    def get_queryset(self):
        userList = []
        for user in User.objects.all():
            bookings = Bookings.objects.all().filter(user_id=user.id)
            info = UserInfos(user_id=user.id, username=user.username,
                             is_superuser=user.is_superuser, is_staff=user.is_staff)
            info.nb_in_process_bookings = bookings.filter(
                Q(status=1) | Q(status=2)).count()
            info.nb_passed_bookings = bookings.filter(Q(status=3)).count()
            info.nb_canceled_bookings = bookings.filter(Q(status=4)).count()
            info.nb_total_bookings = bookings.count()
            avg = 0
            for booking in bookings:
                avg += booking.end.timestamp() - booking.start.timestamp()
            if bookings.count() > 0:
                info.avg_booking_time = avg / bookings.count()
            else:
                info.avg_booking_time = 0
            userList.append(info)
        return userList


# endregion


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


# region rooms


class SpecificRoomsSearch(generics.ListAPIView):
    model = Rooms
    serializer_class = RoomsSerializer

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


class RoomsSearchView(generics.ListAPIView):
    model = RoomSearch
    serializer_class = RoomSearchSerializer

    def get_queryset(self):
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
    # A method that counts the number of computer that have this room id and return the number of computers
    computers = Computers.objects.filter(room=room_id)
    return len(computers)


def add_room(request):
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


# region bookings


# Can list all views if no parameters is given, if book_id set, returns the info of the bokking,
# if user_id is set returns the list of ongoing bookings of the user
class BookingSearchView(generics.ListAPIView):
    model = Bookings
    serializer_class = BookingsSerializer

    def get_queryset(self):
        queryset = Bookings.objects.all()
        id = self.request.query_params.get('book_id')
        userId = self.request.query_params.get('user_id')
        status = self.request.query_params.get('status')
        status2 = self.request.query_params.get('status2')
        if userId is not None:
            if status is not None:
                if status2 is not None:
                    return queryset.filter(Q(status=status) | Q(status=status2), user=userId)
                return queryset.filter(user=userId, status=status)
            return queryset.filter(user=userId)
        elif id is not None:
            return queryset.filter(id=id)


class OnGoingUserBookings(generics.ListAPIView):
    model = Bookings
    serializer_class = BookingsSerializer

    def get_queryset(self):
        queryset = Bookings.objects.all()
        user = User.objects.get(username=self.request.user.username)

        if id is not None:
            queryset = queryset.filter(user=user.id)
            queryset = queryset.filter(status=1)
        return queryset


def bookingsFromStatus(request):
    if request.method == 'GET':
        status = int(request.GET.get('book_status', -1))
        count = bool(request.GET.get('count', False))
        bookings = Bookings.objects.all()
        if status is not None and count is not None:
            bookings = bookings.filter(status=status)
            if count:
                return JsonResponse({'status': status, 'count': bookings.count()})
            return JsonResponse(list(bookings.values()), safe=False)
        return JsonResponse({'status': 'error'})


def add_bookings(request):
    if request.method == 'POST':
        json_body = request.body.decode('utf-8')
        json_body = json.loads(json_body)
        computer = json_body['computer']
        start = json_body['start']
        end = json_body['end']
        if computer is not None and start is not None and end is not None:
            # get the User related to the connected user username
            user = User.objects.get(username=request.user.username)
            # get the Computer related to the computer_id
            computer = Computers.objects.get(id=computer)
            bookingtoAdd = Bookings(
                user=user, computer=computer, start=start, end=end, status=1)
            bookingtoAdd.save()
            return JsonResponse({'status': 'success'})
        return JsonResponse({'status': 'error'})


def add_room(request):
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


def add_pc_in_room(request):
    if request.method == 'POST':
        json_body = request.body.decode('utf-8')
        json_body = json.loads(json_body)
        print(json_body)
        room_id = json_body['room_id'][0]
        pc_name = json_body['pc_name']
        if room_id is not None and pc_name is not None:
            room = Rooms.objects.get(id=room_id)
            pc = Computers(name=pc_name, room=room)
            pc.save()
            return JsonResponse({'status': 'success'})
        return JsonResponse({'status': 'error'})


def avg_booking_time():
    bookings = Bookings.objects.all()
    avg = 0
    for booking in bookings:
        avg += booking.end.timestamp() - booking.start.timestamp()
    if bookings.count() > 0:
        return avg / bookings.count()
    else:
        return 0


class BookingCancelView(generics.ListAPIView):
    model = Bookings
    serializer_class = BookingsSerializer

    def get_queryset(self):
        id = self.request.query_params.get('book_id')
        if id is not None:
            booking = Bookings.objects.get(id=id,
                                           user=User.objects.all().filter(username=self.request.user.username)[0].id)
            booking.status = 4
            booking.save()


class BookingsCreateView(APIView):
    serializer_class = CreateBookingSerializer

    def post(self, request, format=None):
        if(self.request.user.is_authenticated):
            serializer = self.serializer_class(request.data)
            if(serializer.is_valid()):
                computer = serializer.data.computer
                start = serializer.data.start
                end = serializer.data.end
                user = self.request.user
                booking = Bookings(
                    user=user.id, computer=computer, start=start, end=end)
                booking.save()
                return Response(BookingsSerializer(booking).data, status=status.HTTP_201_CREATED)


class BookingsListView(generics.ListAPIView):
    queryset = Bookings.objects.all()
    serializer_class = BookingsSerializer



def get_number_of_bookins_between_two_hours(start, end):
    """
    Returns the number of bookings between two hours
    start is a int representing an hour like 9 or 10
    end is a int representing an hour like 9 or 10
    """
    bookings = Bookings.objects.all()
    tabtoreturn = []
    for booking in bookings:
        if booking.start.hour >= start and booking.start.hour < end:
            tabtoreturn.append(booking)
        elif booking.end.hour >= start and booking.end.hour < end:
            tabtoreturn.append(booking)

    return len(tabtoreturn)



# endregion

def get_busiest_time(request):
    #Imagine that a day start at 7AM and end at 9PM
    #For periods of one hour, we will have a list of the number of bookings of status 1 2 or 3 for each period
    #HAve a dictionary with the period as key and the number of bookings as value
    #Return the highest key and value as JSON
    if request.method == 'GET':
        tab = []
        for i in range(7, 22):
            tab.append(get_number_of_bookins_between_two_hours(i, i+1))
        
        #return the highest value and the corresponding time slot
        timestring = tab.index(max(tab)).__str__() + ":00" + "-" + (tab.index(max(tab))+1).__str__() + ":00"
        return JsonResponse({'time': timestring, 'number_of_bookings': max(tab)})
        