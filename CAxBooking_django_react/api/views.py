import json
from pyexpat import model
from django.http import JsonResponse
from django.shortcuts import redirect
from dateutil import parser


# Create your views here.
from urllib3 import HTTPResponse
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import BookingsSerializer, ComputerInRoomSerializer, ComputerSerializer, CreateBookingSerializer, RoomSearchSerializer, RoomsSerializer, SearchUserSerializer
from .models import Bookings, ComputerInRoom, Computers, RoomSearch, Rooms, Users
# Create your views here.
 

class UserSearchView(generics.ListAPIView):
    model = Users
    serializer_class = SearchUserSerializer
    
    def get_queryset(self):
        if(self.request.user.is_authenticated):
            query = Users.objects.all()
            query = query.filter(username=self.request.user.username)
            return query
        else:
            return None

#region computers

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
        if id is not None:
            queryset = queryset.filter(id=id)
        if roomid is not None:
            queryset = queryset.filter(room=roomid)
        return queryset

#endregion

class SpecificRoomsSearch(generics.ListAPIView):
    model = Rooms
    serializer_class = RoomsSerializer
    def get_queryset(self):
        queryset = Rooms.objects.all()
        id = self.request.query_params.get('room_id')
        if id is not None:
            queryset = queryset.filter(id=id)
        return queryset

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
            RoomSearchI = RoomSearch(room_id = id, room_name = queryset[0].name)
            if timestart is not None and timeend is not None:
                RoomSearchI = RoomSearch(room_id = id, room_name = queryset[0].name , room_capacity = get_room_capacity(id), room_current_capacity = get_room_current_capacity(id, parser.parse(timestart), parser.parse(timeend)))
                listtoreturn.append(RoomSearchI)
                return listtoreturn
            

            
        for (i) in queryset:
            RoomSearchI = RoomSearch(room_id = i.id, room_name = i.name, room_capacity = get_room_capacity(i.id), room_current_capacity = get_room_current_capacity(i.id, parser.parse(timestart), parser.parse(timeend)))
            listtoreturn.append(RoomSearchI)
        return listtoreturn

        




def get_room_current_capacity(room_id,time_start,time_end):
    """A method that counts the number of computer that are not in a booking during this timespan and return the number of computer"""
    computers = Computers.objects.filter(room=room_id)
    computers_in_booking = []
    for computer in computers:
        bookings = Bookings.objects.filter(computer=computer, start__gte=time_start, end__lte=time_end, status=1)
        if len(bookings) > 0:
            computers_in_booking.append(computer)
        
    return len(computers) - len(computers_in_booking)


def get_room_capacity(room_id):
    """A method that counts the number of computer that have this room id and return the number of computers"""
    computers = Computers.objects.filter(room=room_id)
    return len(computers)



#region bookings
"""Can list all views if no parameters is given, if book_id set, returns the info of the bokking, 
if user_id is set returns the list of ongoing bookings of the user"""
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
            queryset = queryset.filter(user_id=userId, status=1)
        return queryset

class OnGoingUserBookings(generics.ListAPIView):
    model = Bookings
    serializer_class = BookingsSerializer
    def get_queryset(self):
        queryset = Bookings.objects.all()
        user = Users.objects.get(username=self.request.user.username)
        
        if id is not None:
            queryset = queryset.filter(user=user.id)
            queryset = queryset.filter(status = 1)
        return queryset

def add_bookings(request):
    if request.method == 'POST':
        json_body = request.body.decode('utf-8')
        json_body = json.loads(json_body)
        print(json_body)
        computer = json_body['computer']
        start = json_body['start']
        end = json_body['end']
        if computer is not None and start is not None and end is not None:
            # get the Users related to the connected user username
            user = Users.objects.get(username=request.user.username)
            # get the Computer related to the computer_id
            computer = Computers.objects.get(id=computer)
            bookingtoAdd = Bookings(user=user, computer=computer, start=start, end=end, status=1)
            bookingtoAdd.save()
            return JsonResponse({'status': 'success'})
        return JsonResponse({'status': 'error'})
    
def add_room(request):
    #take the same model as the one used in the add_bookings
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
            roomtoDelete = Rooms.objects.get(id=room_id[0])
            roomtoDelete.delete()
            return JsonResponse({'status': 'success'})
        return JsonResponse({'status': 'error'})
        
    def add_pc_in_room(request):
        if request.method == 'POST':
            json_body = request.body.decode('utf-8')
            json_body = json.loads(json_body)
            print(json_body)
            room_id = json_body['room_id']
            pc_name = json_body['pc_name']
            if room_id is not None and pc_name is not None:
                room = Rooms.objects.get(id=room_id)
                pc = Computers(name=pc_name, room=room)
                pc.save()
                return JsonResponse({'status': 'success'})
            return JsonResponse({'status': 'error'})


    
    
        
    
class BookingCancelView(generics.ListAPIView):
    model = Bookings
    serializer_class = BookingsSerializer 
    def get_queryset(self):
        id = self.request.query_params.get('book_id')
        if id is not None:
            booking = Bookings.objects.get(id=id, 
                                           user_id = Users.objects.all().filter(username=self.request.user.username)[0].id)
            booking.status=3    
            booking.save()

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
                booking = Bookings(user_id=user,computer=computer, start=start, end=end)
                booking.save()
                return Response(BookingsSerializer(booking).data,status=status.HTTP_201_CREATED)


class BookingsListView(generics.ListAPIView):
    queryset = Bookings.objects.all()
    serializer_class = BookingsSerializer

#endregion  

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
                    #create a ComputerInRoom object for each computer in the room
                    #search in Bookings if there is one for that computer in that time span
                    #if there is one then set the status to 1
                    #else set the status to 0
                    computerInRoomI = ComputerInRoom(computer_id = computer.id, computer_name=computer.name, room_id=computer.room.id, computer_status=0)
                    #search for bookings for that computer in that time span
                    bookings = Bookings.objects.filter(computer=computer.id, start__gte=parser.parse(time_span_start), end__lte=parser.parse(time_span_end), status=1)
                    if(bookings.count() > 0):
                        computerInRoomI.computer_status = 1
                    listtoreturn.append(computerInRoomI)
                    


        return listtoreturn
    





    
   

    
    


   

    



    