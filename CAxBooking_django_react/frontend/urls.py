from django.urls import path
from .views import index, logout_view
from django.contrib.staticfiles.storage import staticfiles_storage
from django.views.generic.base import RedirectView

urlpatterns = [
    path('', index),
    path('login', index),
    path('room/room_id=<int:id>&start=<str:tss>&stop=<str:tse>', index),
    path('logout', logout_view),
    path('admin', index),
    path('userGuide', index),
    path('main', index),
    path('favicon.ico', RedirectView.as_view(
        url=staticfiles_storage.url('img/favicon.ico')))
]
