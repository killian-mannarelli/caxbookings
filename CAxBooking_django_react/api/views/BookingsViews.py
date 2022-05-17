from calendar import day_name, month, monthrange, month_name
from datetime import datetime, timedelta
from pyexpat import model
from django.forms import model_to_dict
from django.http import JsonResponse
from django.db.models import Q
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from ..serializers import *
from ..models import Bookings, Computers, Rooms
from dateutil.relativedelta import relativedelta

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


def avg_booking_time_ever(request):
    bookings = Bookings.objects.all()
    avg = 0
    for booking in bookings:
        avg += booking.end.timestamp() - booking.start.timestamp()
    if bookings.count() > 0:
        avg = avg / bookings.count()
        min = str(math.floor(avg / 60) % 6)
        if math.floor(avg / 60) < 10:
            min = '0'+str(math.floor(avg / 60) % 6)
        return {'avg_time': str(int((avg - (avg % 3600)) / 3600)) + "h" + min}
    else:
        return {'avg_time': "--h--"}


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


def get_busiest_time(request):
    # Imagine that a day start at 7AM and end at 9PM
    # For periods of one hour, we will have a list of the number of bookings of status 1 2 or 3 for each period
    # Have a dictionary with the period as key and the number of bookings as value
    # Return the highest key and value as JSON
    if request.method == 'GET':
        tab = []
        for i in range(7, 22):
            tab.append(get_number_of_bookins_between_two_hours(i, i+1))

        # return the highest value and the corresponding time slot
        timestring = tab.index(max(tab)).__str__(
        ) + ":00" + "-" + (tab.index(max(tab))+1).__str__() + ":00"
        return JsonResponse({'time': timestring, 'number_of_bookings': max(tab)})


def getBookedRooms(bookings):
    allRooms = Rooms.objects.all()
    roomsData = {}
    for room in allRooms:
        computers = Computers.objects.filter(room=room.id)
        roomsData[room.name]= len(bookings.filter(computer__in=computers))
    return roomsData

def avg_booking_time_in_selection(bookings):
    avg = 0
    for booking in bookings:
        avg += booking.end.timestamp() - booking.start.timestamp()
    if bookings.count() > 0:
        avg = avg / bookings.count()
        min = str(math.floor(avg / 60) % 60)
        if math.floor(avg / 60) % 60 < 10:
            min = '0'+str(math.floor(avg / 60) % 60)
        return str(int((avg - (avg % 3600)) / 3600)) + "h" + min
    else:
        return "--h--"


def bookingOverYear(offset):

    date = datetime.now()

    start = datetime(year=date.year + offset, day=1, month=1, hour=0,
                     minute=0, second=0, microsecond=0)
    end = start + relativedelta(years=+1)

    bookings = Bookings.objects.all().filter(start__gte=start,
                                             start__lte=end)

    roomsData = getBookedRooms(bookings)
    avgBookTime=avg_booking_time_in_selection(bookings)

    nbTotal = bookings.count()
    nbCancel = bookings.filter(status=4).count()
    nbOngoing = bookings.filter(~Q(status=4)).count()
    nbAvgOverRange = nbTotal/365
    


    title = f"Bookings of year {start.year}"
    listLabels = []
    allDataValue = []
    ongoingDataValue = []
    canceledDataValue = []
    for i in range(0, 11):
        bookingsRange = bookings.filter(start__gte=start + relativedelta(months=i),
                                        start__lte=start + relativedelta(months=i+1))
        listLabels.append(
            f"{month_name[(start + relativedelta(months=i)).month]}")
        allDataValue.append(bookingsRange.count())
        canceledDataValue.append(bookingsRange.filter(status=4).count())
        ongoingDataValue.append(bookingsRange.filter(~Q(status=4)).count())
        

    return {'title': title, 'labels': listLabels,  'allData': allDataValue, 'canceledData': canceledDataValue,
            'ongoingData': ongoingDataValue, 'roomsData': roomsData, 'nbBookTotal':nbTotal, 'nbCancel':nbCancel, 
            'nbOngoing':nbOngoing, 'nbAvgOverRange':nbAvgOverRange, 'avgBookTime':avgBookTime}


def bookingOverMonth(offset):

    date = datetime.now()

    start = date - relativedelta(days=date.day-1, months=-offset)
    daysInMonth = monthrange(start.year, start.month)[1]
    end = start + relativedelta(days=daysInMonth)

    bookings = Bookings.objects.all().filter(start__gte=start,
                                             start__lte=end)

    roomsData = getBookedRooms(bookings)
    avgBookTime=avg_booking_time_in_selection(bookings)
    busiestTime=get_busiest_time

    nbTotal = bookings.count()
    nbCancel = bookings.filter(status=4).count()
    nbOngoing = bookings.filter(~Q(status=4)).count()
    nbAvgOverRange = nbTotal/daysInMonth

    title = f"Bookings of {month_name[start.month]} {start.year}"
    listLabels = []
    allDataValue = []
    canceledDataValue = []
    ongoingDataValue = []
    for i in range(0, daysInMonth):
        bookingsRange = bookings.filter(start__gte=start + relativedelta(days=i),
                                        start__lte=start + relativedelta(days=i + 1))
        listLabels.append(
            f"{(start + relativedelta(days=i)).day}/{start.month}")
        allDataValue.append(bookingsRange.count())
        canceledDataValue.append(bookingsRange.filter(status=4).count())
        ongoingDataValue.append(bookingsRange.filter(~Q(status=4)).count())

    return {'title': title, 'labels': listLabels, 'allData': allDataValue, 'canceledData': canceledDataValue,
            'ongoingData': ongoingDataValue, 'roomsData': roomsData, 'nbBookTotal':nbTotal, 'nbCancel':nbCancel,
            'nbOngoing':nbOngoing, 'nbAvgOverRange':nbAvgOverRange, 'avgBookTime':avgBookTime}


def bookingOverWeek(offset):

    date = datetime.now()

    start = date - relativedelta(days=date.weekday())
    start = start + relativedelta(days=offset*7)
    end = start + relativedelta(days=6)

    bookings = Bookings.objects.all().filter(start__gte=start,
                                             start__lte=end)

    roomsData = getBookedRooms(bookings)
    avgBookTime=avg_booking_time_in_selection(bookings)

    nbTotal = bookings.count()
    nbCancel = bookings.filter(status=4).count()
    nbOngoing = bookings.filter(~Q(status=4)).count()
    nbAvgOverRange = nbTotal/7

    title = f"Bookings of week n°{start.isocalendar()[1]} of {start.year}"
    listLabels = []
    allDataValue = []
    canceledDataValue = []
    ongoingDataValue = []
    for i in range(0, 7):
        bookingsRange = bookings.filter(start__gte=start + relativedelta(days=i),
                                        start__lte=start + relativedelta(days=i+1))
        listLabels.append(
            f"{(start + relativedelta(days=i)).day}/{start.month}")
        allDataValue.append(bookingsRange.count())
        canceledDataValue.append(bookingsRange.filter(status=4).count())
        ongoingDataValue.append(bookingsRange.filter(~Q(status=4)).count())

    return {'title': title, 'labels': listLabels, 'allData': allDataValue, 'canceledData': canceledDataValue,
            'ongoingData': ongoingDataValue, 'roomsData': roomsData, 'nbBookTotal':nbTotal, 'nbCancel':nbCancel,
            'nbOngoing':nbOngoing, 'nbAvgOverRange':nbAvgOverRange, 'avgBookTime':avgBookTime}


def bookingOverDay(offset):

    date = datetime.now()

    start = date - relativedelta(day=date.day + offset, hours=date.hour,
                                 minutes=date.minute, seconds=date.second, microseconds=date.microsecond)
    end = start + relativedelta(days=1)

    bookings = Bookings.objects.all().filter(start__gte=start,
                                             start__lte=end)

    roomsData = getBookedRooms(bookings)
    avgBookTime=avg_booking_time_in_selection(bookings)

    nbTotal = bookings.count()
    nbCancel = bookings.filter(status=4).count()
    nbOngoing = bookings.filter(~Q(status=4)).count()
    nbAvgOverRange = nbTotal/14
    

    title = f"Bookings of {start.day}th of {month_name[start.month]} {start.year}"
    listLabels = []
    allDataValue = []
    canceledDataValue = []
    ongoingDataValue = []
    for i in range(7, 21):
        bookingsRange = bookings.filter((Q(start__hour__lt=i+1) & Q(start__hour__gte=i))
                                        | (Q(end__hour__lt=i+1) & Q(end__hour__gte=i)))
        listLabels.append(f"{i}h")
        allDataValue.append(bookingsRange.count())
        canceledDataValue.append(bookingsRange.filter(status=4).count())
        ongoingDataValue.append(bookingsRange.filter(~Q(status=4)).count())

    return {'title': title, 'labels': listLabels, 'allData': allDataValue, 'canceledData': canceledDataValue,
            'ongoingData': ongoingDataValue, 'roomsData': roomsData, 'nbBookTotal':nbTotal, 'nbCancel':nbCancel,
            'nbOngoing':nbOngoing, 'nbAvgOverRange':nbAvgOverRange, 'avgBookTime':avgBookTime}


def statsOverall(request):
    if request.method == 'GET':
        offset = int(request.GET.get('offset', 0))
        print(bookingOverDay(offset))
        return JsonResponse({'day': bookingOverDay(offset), 'week': bookingOverWeek(offset),
                            'month': bookingOverMonth(offset), 'year': bookingOverYear(offset), })
