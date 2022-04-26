from django.urls import path
from .views import BookingSearchView, BookingsCreateView, BookingsListView, ComputerListView, ComputerSearchView
from .login import login_verify

urlpatterns = [
    path('login/', login_verify),
    path('computer',ComputerListView.as_view()),
    path('computersearch', ComputerSearchView.as_view()), 
    path('bookings/create', BookingsCreateView.as_view()),
    path('bookings/list', BookingsListView.as_view()),
    path('bookings/search', BookingSearchView.as_view()),

   
]