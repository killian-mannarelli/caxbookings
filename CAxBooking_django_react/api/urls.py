from django.urls import path
from .views import ComputerListView, ComputerSearchView
from .login import loginverify
urlpatterns = [
    #create a path with loginverify and fill the arguments
    path('computer',ComputerListView.as_view()),
    path('login/', loginverify),
    #make a path for the computersearch
    path('computersearch', ComputerSearchView.as_view()),

   
]