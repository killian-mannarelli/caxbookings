from django.urls import path
from .views import ComputerListView, ComputerSearchView
from .login import loginverify
urlpatterns = [
    path('computer',ComputerListView.as_view()),
    path('login/', loginverify),
    path('computersearch', ComputerSearchView.as_view()),

   
]