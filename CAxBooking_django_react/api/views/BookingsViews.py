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
from ..models import Bookings, Computers, GlobalVariables, Rooms
from dateutil.relativedelta import relativedelta

import json
import math

# All of the different bookings views



class BookingSearchView(generics.ListAPIView):
# Can list all views if no parameters is given, if book_id set, returns the info of the bokking,
# if user_id is set returns the list of ongoing bookings of the user
    model = Bookings
    serializer_class = BookingsSerializer

    def get_queryset(self):
        """
        If the userId is not None, then return the queryset filtered by the userId and status. If the
        status is not None, then return the queryset filtered by the userId and status. If the status2
        is not None, then return the queryset filtered by the userId and status2. If the id is not None,
        then return the queryset filtered by the id
        :return: The queryset is being returned.
        """
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
# Lists all pf the ongoing bookings of a given user
    model = Bookings
    serializer_class = BookingsSerializer

    def get_queryset(self):
        """
        If the user is logged in, return all the bookings that have a status of 1 and belong to the
        logged in user
        :return: The queryset is being returned.
        """
        queryset = Bookings.objects.all()
        user = User.objects.get(username=self.request.user.username)

        if id is not None:
            queryset = queryset.filter(user=user.id)
            queryset = queryset.filter(status=1)
        return queryset


def bookingsFromStatus(request):
    """
    It returns a JSON response of the bookings with the given status, or the count of the bookings with
    the given status
    
    :param request: The request object is a Python object that contains all the information about the
    request that was sent to the server
    :return: A list of bookings with the given status, or the count of bookings with the given status.
    """
    
    if request.method == 'GET':
        status = int(request.GET.get('book_status', 1))
        count = bool(request.GET.get('count', False))
        bookings = Bookings.objects.all()
        if status is not None and count is not None:
            bookings = bookings.filter(status=status)
            if count:
                return JsonResponse({'status': status, 'count': bookings.count()})
            return JsonResponse(list(bookings.values()), safe=False)
        return JsonResponse({'status': 'error'})


def add_bookings(request):
    """
    It takes a POST request, extracts the data from the request, and saves it to the database
    
    :param request: the request object
    :return: A JsonResponse with the status of the request.
    """
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
    """
    It takes a POST request, decodes the body of the request, loads the body into a json object, and
    then saves the room name into the database
    
    :param request: The request object is a Python object that contains all the information about the
    request that was sent to the server
    :return: a JsonResponse object.
    """
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
    """
    It takes a POST request with a JSON body containing a room_id and a pc_name, and adds a new computer
    to the database with the given name and room
    
    :param request: The request object that Django uses to represent and manage an HTTP request
    :return: A JsonResponse object.
    """
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


# It's a ListAPIView that takes a query parameter called book_id, finds the booking with that id, and
# sets its status to 4
class BookingCancelView(generics.ListAPIView):
    model = Bookings
    serializer_class = BookingsSerializer

    def get_queryset(self):
        """
        It gets the booking id from the query params, gets the booking object, sets the status to 4 and
        saves it
        """
        id = self.request.query_params.get('book_id')
        if id is not None:
            booking = Bookings.objects.get(id=id,
                                           user=User.objects.all().filter(username=self.request.user.username)[0].id)
            booking.status = 4
            booking.save()


class BookingsCreateView(APIView):
    serializer_class = CreateBookingSerializer

    def post(self, request, format=None):
        """
        It takes a request, checks if the user is authenticated, then creates a booking object and saves it
        to the database.
        
        :param request: The full HTTP request object
        :param format: The format of the response
        :return: The booking object is being returned.
        """
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
    """
    It returns the time slot with the highest number of bookings
    
    :param request: the request object
    :return: The busiest time slot and the number of bookings in that time slot.
    """
    if request.method == 'GET':
        tab = []
        for i in range(7, 22):
            tab.append(get_number_of_bookins_between_two_hours(i, i+1))

        # return the highest value and the corresponding time slot
        timestring = tab.index(max(tab)).__str__(
        ) + ":00" + "-" + (tab.index(max(tab))+1).__str__() + ":00"
        return JsonResponse({'time': timestring, 'number_of_bookings': max(tab)})


def getBookedRooms(bookings):
    """
    It takes a queryset of bookings and returns a dictionary of room names and the number of bookings in
    each room
    
    :param bookings: A queryset of all the bookings
    :return: A dictionary of rooms and the number of bookings in each room.
    """
    allRooms = Rooms.objects.all()
    roomsData = {}
    for room in allRooms:
        computers = Computers.objects.filter(room=room.id)
        roomsData[room.name] = len(bookings.filter(computer__in=computers))
    return roomsData


def avg_booking_time_in_selection(bookings):
    """
    It takes a list of bookings and returns the average booking time in the format "hh:mm"
    
    :param bookings: a queryset of bookings
    :return: A string with the average booking time in hours and minutes.
    """
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
    """
    It returns a dictionary containing the title of the graph, the labels of the graph, the data of the
    graph, the number of ongoing bookings, the average number of bookings per day, and the average
    booking time.
    
    :param offset: the number of years to offset from the current year
    :return: A dictionary with the following keys:
        title: The title of the graph
        labels: A list of labels for the x-axis
        ongoingData: A list of values for the y-axis
        roomsData: A list of values for the y-axis
        nbOngoing: The number of ongoing bookings
        nbAvgOverRange: The
    """

    date = datetime.now()

    start = datetime(year=date.year + offset, day=1, month=1, hour=0,
                     minute=0, second=0, microsecond=0)
    end = start + relativedelta(years=+1)

    bookings = Bookings.objects.all().filter(start__gte=start,
                                             start__lte=end)

    roomsData = getBookedRooms(bookings)
    avgBookTime = avg_booking_time_in_selection(bookings)

    nbTotal = bookings.count()
    nbCancel = bookings.filter(status=4).count()
    nbOngoing = bookings.filter(~Q(status=4)).count()
    nbAvgOverRange = nbOngoing/365

    title = f"Bookings of year {start.year}"
    listLabels = []
    allDataValue = []
    ongoingDataValue = []
    canceledDataValue = []
    for i in range(0, 12):
        bookingsRange = bookings.filter(start__gte=start + relativedelta(months=i),
                                        start__lte=start + relativedelta(months=i+1))
        listLabels.append(
            f"{month_name[(start + relativedelta(months=i)).month]}")
        allDataValue.append(bookingsRange.count())
        canceledDataValue.append(bookingsRange.filter(status=4).count())
        ongoingDataValue.append(bookingsRange.filter(~Q(status=4)).count())

    return {'title': title, 'labels': listLabels,  'ongoingData': ongoingDataValue, 'roomsData': roomsData,
            'nbOngoing': nbOngoing, 'nbAvgOverRange': nbAvgOverRange, 'avgBookTime': avgBookTime}


def bookingOverMonth(offset):
    """
    It returns a dictionary containing the title of the graph, the labels of the graph, the data of the
    graph, the number of ongoing bookings, the average number of bookings per day, and the average
    booking time
    
    :param offset: the number of months to go back in time
    :return: A dictionary with the title, labels, ongoingData, roomsData, nbOngoing, nbAvgOverRange, and
    avgBookTime.
    """

    date = datetime.now()

    start = date - relativedelta(days=date.day-1, months=-offset)
    daysInMonth = monthrange(start.year, start.month)[1]
    end = start + relativedelta(days=daysInMonth)

    bookings = Bookings.objects.all().filter(start__gte=start,
                                             start__lte=end)

    roomsData = getBookedRooms(bookings)
    avgBookTime = avg_booking_time_in_selection(bookings)
    busiestTime = get_busiest_time

    nbTotal = bookings.count()
    nbCancel = bookings.filter(status=4).count()
    nbOngoing = bookings.filter(~Q(status=4)).count()
    nbAvgOverRange = nbOngoing/daysInMonth

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

    return {'title': title, 'labels': listLabels, 'ongoingData': ongoingDataValue, 'roomsData': roomsData,
            'nbOngoing': nbOngoing, 'nbAvgOverRange': nbAvgOverRange, 'avgBookTime': avgBookTime}


def bookingOverWeek(offset):
    """
    It returns a dictionary containing the data for the bookings of a week, given an offset
    
    :param offset: the number of weeks to go back from the current week
    :return: A dictionary with the following keys:
        title: The title of the graph
        labels: The labels of the graph
        ongoingData: The data of the graph
        roomsData: The data of the graph
        nbOngoing: The number of ongoing bookings
        nbAvgOverRange: The average number of bookings per day
        avgBookTime
    """

    date = datetime.now()

    start = date - relativedelta(days=date.weekday())
    start = start + relativedelta(days=offset*7)
    end = start + relativedelta(days=6)

    bookings = Bookings.objects.all().filter(start__gte=start,
                                             start__lte=end)

    roomsData = getBookedRooms(bookings)
    avgBookTime = avg_booking_time_in_selection(bookings)

    nbTotal = bookings.count()
    nbCancel = bookings.filter(status=4).count()
    nbOngoing = bookings.filter(~Q(status=4)).count()
    nbAvgOverRange = nbOngoing/7

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

    return {'title': title, 'labels': listLabels, 'ongoingData': ongoingDataValue, 'roomsData': roomsData,
            'nbOngoing': nbOngoing, 'nbAvgOverRange': nbAvgOverRange, 'avgBookTime': avgBookTime}


def bookingOverDay(offset):
    """
    It takes an offset (in days) and returns a dictionary containing
    the title of the graph, the labels, the data for the ongoing bookings, the data for the rooms, the
    number of ongoing
    bookings, the average number of ongoing bookings over the range, and the average booking time.
    
    :param offset: the number of days before today to look at. 0 is today, 1 is yesterday, etc
    :return: A dictionary with the title, labels, ongoingData, roomsData, nbOngoing, nbAvgOverRange, and
    avgBookTime
    """

    date = datetime.now()

    start = date - relativedelta(day=date.day + offset, hours=date.hour,
                                 minutes=date.minute, seconds=date.second, microseconds=date.microsecond)
    end = start + relativedelta(days=1)

    bookings = Bookings.objects.all().filter(start__gte=start,
                                             start__lte=end)

    roomsData = getBookedRooms(bookings)
    avgBookTime = avg_booking_time_in_selection(bookings)

    nbTotal = bookings.count()
    nbCancel = bookings.filter(status=4).count()
    nbOngoing = bookings.filter(~Q(status=4)).count()
    nbAvgOverRange = nbOngoing/(14*15)

    title = f"Bookings of {start.day}th of {month_name[start.month]} {start.year}"
    listLabels = []
    allDataValue = []
    canceledDataValue = []
    ongoingDataValue = []
    for i in range(7, 21):
        for j in range(0, 4):
            print(start + relativedelta(hours=i, minutes=15*(j+1)))
            bookingsRange = bookings.filter((Q(start__lt= start + relativedelta(hours=i, minutes=15*j))
                                            & Q(end__gte=start + relativedelta(hours=i, minutes=15*j+1))))
            listLabels.append(f"{i}h{j*15}")
            allDataValue.append(bookingsRange.count())
            canceledDataValue.append(bookingsRange.filter(status=4).count())
            ongoingDataValue.append(bookingsRange.filter(~Q(status=4)).count())

    return {'title': title, 'labels': listLabels, 'ongoingData': ongoingDataValue, 'roomsData': roomsData,
            'nbOngoing': nbOngoing, 'nbAvgOverRange': nbAvgOverRange, 'avgBookTime': avgBookTime}


def statsOverall(request):
    """
    It takes a GET request, and returns a JSON object containing the number of bookings over the last
    day, week, month, and year
    
    :param request: The request object
    :return: A list of dictionaries, each dictionary contains the number of bookings for a given day.
    """
    if request.method == 'GET':
        offset = int(request.GET.get('offset', 0))
        return JsonResponse({'day': bookingOverDay(offset), 'week': bookingOverWeek(offset),
                            'month': bookingOverMonth(offset), 'year': bookingOverYear(offset), })



# This class is a ListAPIView that returns a list of all GlobalVariables objects, and uses the
# GlobalVariablesSerializer to serialize the data
class ModifyMaxBookingTimeView(generics.ListAPIView):
    model = GlobalVariables
    queryset = GlobalVariables.objects.all()
    serializer_class = GlobalVariablesSerializer

    def post(self, request, format=None):
        """
        It takes the value of the max_booking_time from the request and updates the value of the global
        variable maximum_booking_time with the new value
        
        :param request: The request object
        :param format: The format of the response
        :return: The response is a JSON object with the key "error" and the value "max_booking_time is
        missing"
        """
        max_booking_time = request.data.get('max_booking_time')
        if(max_booking_time is None):
            return Response({"error": "max_booking_time is missing"}, status=status.HTTP_400_BAD_REQUEST)
        #find the global variable with name maximum_booking_time
        global_variable = GlobalVariables.objects.get(name='maximum_booking_time')
        #update the value of the global variable
        global_variable.value = max_booking_time
        #save the global variable
        global_variable.save()
        return Response(status=status.HTTP_200_OK)


# This class is a ListAPIView that returns a list of all GlobalVariables objects.
class MaxBookingTimeView(generics.ListAPIView):
    model = GlobalVariables
    queryset = GlobalVariables.objects.all()

    def get(self, request, format=None):
        """
        It gets the value of the global variable named 'maximum_booking_time' from the database and
        returns it to the user
        
        :param request: The request object
        :param format: The format of the response
        :return: The maximum booking time is being returned.
        """
        global_variable = GlobalVariables.objects.get(name='maximum_booking_time')
        return Response({"max_booking_time": global_variable.value}, status=status.HTTP_200_OK)


    
