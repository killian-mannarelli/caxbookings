from django.urls import path
from .views import BookingSearchView, BookingsListView, ComputerInRoomListView, ComputerListView, ComputerSearchView, OnGoingUserBookings, RoomsSearchView, add_bookings
from .login import login_verify

urlpatterns = [
    path('login/', login_verify),
    path('computers/list',ComputerListView.as_view()),
    path('computers/search', ComputerSearchView.as_view()), 
    path('rooms/search', RoomsSearchView.as_view()), 
    path('bookings/create', add_bookings),
    path('bookings/user/ongoing', OnGoingUserBookings.as_view()),
    path('bookings/list', BookingsListView.as_view()),
    path('bookings/search', BookingSearchView.as_view()),
    path('computerinroom',ComputerInRoomListView.as_view()),

   
]