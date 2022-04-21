from django.urls import path
from .views import ComputerListView, ComputerSearchView
from .login import login_verify
urlpatterns = [
    path('computer',ComputerListView.as_view()),
    path('login/', login_verify),
    path('computersearch', ComputerSearchView.as_view()),

   
]