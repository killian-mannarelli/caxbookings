from django.urls import path
from .views import BookingsCreateView, BookingsListView, ComputerListView, ComputerSearchView
from .login import loginverify
urlpatterns = [
    path('login/', loginverify),
    path('computer',ComputerListView.as_view()),
    path('computersearch', ComputerSearchView.as_view()), 
    path('bookings/create', BookingsCreateView.as_view()),
    path('bookings/list', BookingsListView.as_view()),

   
]