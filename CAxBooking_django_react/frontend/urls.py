from django.urls import path
from .views import index, logout_view

urlpatterns = [
    path('', index), 
    path('login', index),
    path('room/room_id=<int:id>&start=<str:tss>&stop=<str:tse>', index),
    path('logout', logout_view),
    path('main', index),
]