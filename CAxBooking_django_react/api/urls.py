from django.urls import path
from .views import BookingSearchView, BookingsCreateView, BookingsListView, ComputerListView, ComputerSearchView, RoomsSearchView
from .login import login_verify

urlpatterns = [
    path('login/', login_verify),
    path('computers/list',ComputerListView.as_view()),
    path('computers/search', ComputerSearchView.as_view()), 
    path('rooms/search', RoomsSearchView.as_view()), 
    path('bookings/create', BookingsCreateView.as_view()),
    path('bookings/list', BookingsListView.as_view()),
    path('bookings/search', BookingSearchView.as_view()),

   
]