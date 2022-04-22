from django.urls import path
from .views import index, logout_view

urlpatterns = [
    path('', index), 
    path('login', index),
    path('room/<int:id>', index),
    path('logout', logout_view),
    path('main', index),
]