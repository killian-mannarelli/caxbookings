from calendar import monthrange
from datetime import datetime, timedelta
from pyexpat import model
from django.http import JsonResponse
from django.db.models import Q
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from ..serializers import *
from ..models import Bookings, Computers, Rooms

import json
import math

# region bookings


# Can list all views if no parameters is given, if book_id set, returns the info of the bokking,
# if user_id is set returns the list of ongoing bookings of the user

class BookingSearchView(generics.ListAPIView):
    model = Bookings
    serializer_class = BookingsSerializer

    def get_queryset(self):
        queryset = Bookings.objects.all().order_by('start')
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


def avg_booking_time(request):
    bookings = Bookings.objects.all()
    avg = 0
    for booking in bookings:
        avg += booking.end.timestamp() - booking.start.timestamp()
    avg = avg / bookings.count()
    if bookings.count() > 0:
        return JsonResponse({'avg_time': str(int((avg - (avg % 3600)) / 3600)) + "h" + str(math.floor(avg / 60) % 60)})
    else:
        return JsonResponse({'avg_time': "--h--"})


def bookingOverTime(request):
    if request.method == 'POST':
        json_body = request.body.decode('utf-8')
        json_body = json.loads(json_body)
        offset = json_body['offset']
        date = datetime.now()


def bookingOverYear(request):
    date = datetime.now()
    bookings = Bookings.objects.all().filter(start__gte=datetime(date.year, 1, 1),
                                             start__lte=datetime(date.year + 1, 1, 1))
    listMonths = []
    for i in range(1, 12):
        listMonths.append({str(i):  bookings.filter(start__gte=datetime(date.year, i, 1),
                                                    start__lte=datetime(date.year, i + 1, 1)).count()})
    listMonths.append({str(12):  bookings.filter(start__gte=datetime(date.year, 12, 1),
                                                 start__lte=datetime(date.year + 1,  1, 1)).count()})
    return JsonResponse({'year': listMonths})


def bookingOverMonth(request):
    date = datetime.now()
    yearOffset = 0

    if date.month < 0:
        yearOffset = -1
    if date.month > 12:
        yearOffset = 1

    daysInMonth = monthrange(date.year + yearOffset, date.month % 12)[1]

    start = date - timedelta(days=date.day)
    end = start + timedelta(days=daysInMonth)

    bookings = Bookings.objects.all().filter(start__gte=start,
                                             start__lte=end)

    listDays = []

    for i in range(0, daysInMonth):
        listDays.append({str(i+1):  bookings.filter(start__gte=start + timedelta(days=i),
                                                    start__lte=start + timedelta(days=i + 1)).count()})

    return JsonResponse({'month': listDays})


def bookingOverWeek(request):
    date = datetime.now()

    start = date - timedelta(days=date.weekday())
    end = start + timedelta(days=6)

    bookings = Bookings.objects.all().filter(start__gte=start,
                                             start__lte=end)

    listDays = []

    for i in range(0, 7):
        listDays.append({str(i+1):  bookings.filter(start__gte=start + timedelta(days=i),
                                                    start__lte=start + timedelta(days=i+1)).count()})

    return JsonResponse({'week': listDays})


def bookingOverDay(request):
    date = datetime.now()

    start = date - timedelta(hours=date.hour,
                             minutes=date.minute, seconds=date.second, microseconds=date.microsecond)
    end = start + timedelta(days=1)

    bookings = Bookings.objects.all().filter(start__gte=start,
                                             start__lte=end)
    listHours = []

    for i in range(7, 21):
        nbBook = 0
        for booking in bookings:
            if i + 1 > booking.start.hour >= i or i + 1 > booking.end.hour >= i:
                nbBook = nbBook + 1
        listHours.append({i: nbBook})
    print(bookings.count())
    return JsonResponse({'hours': listHours})


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

# endregion
