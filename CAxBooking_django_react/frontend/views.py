from django.shortcuts import render


def index(request, *args, **kwargs):
    return render(request, 'frontend/index.html')

def request_login(request, *args, **kwargs):
    return render(request, 'frontend/login.html')