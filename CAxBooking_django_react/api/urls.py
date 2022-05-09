from django.urls import path
from .views import BookingSearchView, BookingsListView, OnGoingUserBookings, ComputerInRoomListView, ComputerListView, ComputerSearchView, RoomsSearchView
from .views import SpecificRoomsSearch, add_bookings, BookingCancelView, UserSearchView, add_room, delete_room, bookingsFromStatus
from .login import login_verify

urlpatterns = [
    path('login/', login_verify),
    path('users/getCurrent', UserSearchView.as_view()),
    
    path('computers/list',ComputerListView.as_view()),
    path('computers/search', ComputerSearchView.as_view()), 
    
    path('rooms/search', RoomsSearchView.as_view()), 
    path('rooms/search/specific', SpecificRoomsSearch.as_view()),
    path('rooms/create', add_room),
    path('rooms/delete', delete_room),
    
    path('computerinroom',ComputerInRoomListView.as_view()),
    
    path('bookings/create', add_bookings),
    path('bookings/list', BookingsListView.as_view()),
    path('bookings/search', BookingSearchView.as_view()),
    path('bookings/delete', BookingCancelView.as_view()),
    path('bookings/user/ongoing', OnGoingUserBookings.as_view()),
    path('bookings/status', bookingsFromStatus),
]