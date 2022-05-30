from django.shortcuts import redirect, render
from django.contrib.auth import logout


def index(request, *args, **kwargs):
    if(request.user.is_authenticated):
        return render(request, 'frontend/index.html')
    else:
        #if the string of the request don't contain the word login
        #then redirect to the login page
        if "isBooked" in request.path:
            return render(request, 'frontend/index.html')
        if('login' not in request.path):
            return redirect('/login')
        return render(request, 'frontend/index.html')
    

def request_login(request, *args, **kwargs):
    return render(request, 'frontend/login.html')

def logout_view(request, *args, **kwargs):
    logout(request)
    return redirect('/login')
