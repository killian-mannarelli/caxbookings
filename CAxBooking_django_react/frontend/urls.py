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
    path('adminGuide', index),
    path('adminContact', index),
    path('main', index),
    path('isBooked/<slug:host_name>', index),
    path('favicon.ico', RedirectView.as_view(
        url=staticfiles_storage.url('img/favicon.ico'))),
    path('JadeHsLogo', RedirectView.as_view(
        url=staticfiles_storage.url('img/Logo_Jade_Hochschule-removebg-preview.png'))),
    path('AdminGuide.md', RedirectView.as_view(
        url=staticfiles_storage.url('markdown/AdminGuide.md'))),
    path('UserGuide.md', RedirectView.as_view(
        url=staticfiles_storage.url('markdown/UserGuide.md')))
]
