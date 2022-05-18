import json
from django.http import JsonResponse
from django.db.models import Q
from django.contrib.auth.models import User
from rest_framework import generics

from api.views.BookingsViews import avg_booking_time_in_selection
from ..serializers import *
from ..models import Bookings, UserInfos
# Create your views here.


# region users


class CurrentUserSearchView(generics.ListAPIView):
    model = User
    serializer_class = UserSerializer

    def get_queryset(self):
        """
        If the user is authenticated, return all users with the same username as the current user
        :return: The query is being returned.
        """
        if(self.request.user.is_authenticated):
            query = User.objects.all()
            query = query.filter(username=self.request.user.username)
            return query
        else:
            return None


# This class is a view that allows a user to search for other users by id, username, or admin level
class UserSearchView(generics.ListAPIView):
    model = User
    serializer_class = UserSerializer

    def get_queryset(self):
        """
        If the user is a staff member or superuser, then return the queryset of all users. If the user is
        not a staff member or superuser, then return None
        :return: A list of all users
        """
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
    """
    It takes a list of user ids, finds all the bookings related to each user, deletes the bookings, then
    deletes the user
    
    :param request: The request object is a Python object that contains all the information about the
    request that was made to the server
    :return: a JsonResponse object with a status of success or error.
    """
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
    """
    It deletes a user from the database
    
    :param request: The request object is a Python object that contains all the information about the
    request sent by the client
    :return: a JsonResponse object.
    """
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
    """
    It takes a request from the frontend, checks if the user is a superuser, then checks if the request
    is a POST request, then it decodes the request body, loads it into a json object, then it gets the
    user id, is_superuser, and is_staff from the json object, then it gets the user object from the
    database, then it sets the user's is_superuser and is_staff to the values from the json object, then
    it saves the user object, then it returns a success message
    
    :param request: The request object is the first parameter to the view. It contains the HTTP request
    that was made to the server
    :return: A JsonResponse object is being returned.
    """
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
        """
        It creates a list of UserInfos objects, each of which contains information about a user
        :return: A list of UserInfos objects.
        """
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
            info.avg_booking_time = avg_booking_time_in_selection(bookings)
            userList.append(info)
        return userList


# endregion

