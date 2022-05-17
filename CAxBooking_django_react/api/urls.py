from django.urls import path

from api.views.BookingsViews import *
from api.views.RoomsViews import *
from api.views.UsersViews import *
from .views.ComputersViews import *
from .admin import *
from .login import login_verify

urlpatterns = [
    path('login/', login_verify),
    path('users/getCurrent', CurrentUserSearchView.as_view()),
    path('users/getUsers', UserSearchView.as_view()),
    path('users/usersInfos', UserInfosView.as_view()),
    path('users/modifyUser', modify_user),
    path('users/deleteUser', delete_user),
    path('users/deleteUsers', delete_users),

    path('computers/list', ComputerListView.as_view()),
    path('computers/search', ComputerSearchView.as_view()),
    path('computers/create', add_pc_in_room),
    path('computers/delete', delete_room_computer),
    path('computers/modify', ComputerModifyView.as_view()),
    path('computerinroom', ComputerInRoomListView.as_view()),

    path('rooms/search', RoomsSearchView.as_view()), 
    path('rooms/search/specific', SpecificRoomsSearch.as_view()),
    path('rooms/create', add_room),
    path('rooms/delete', delete_room),
    path('rooms/modify', RoomsViewSet.as_view()),
    path('rooms/mostbooked', MostBookedRoomsSearch.as_view()),


    path('bookings/list', BookingsListView.as_view()),
    path('bookings/search', BookingSearchView.as_view()),
    path('bookings/create', add_bookings),
    path('bookings/delete', BookingCancelView.as_view()),
    path('bookings/user/ongoing', OnGoingUserBookings.as_view()),
    path('bookings/status', bookingsFromStatus),   

    path('times/mostbooked', get_busiest_time),
    
    path('bookings/status', bookingsFromStatus),           
    path('bookings/stats-overall', statsOverall),     
    path('bookings/overmonth', bookingOverMonth),     
    path('bookings/overweek', bookingOverWeek),     
    path('bookings/overday', bookingOverDay),

    path('db/bookings', export_csv)  ,
    path('bookings/avgBookingTime', avg_booking_time_ever),     
    path('bookings/stats-overall', statsOverall),    
]

