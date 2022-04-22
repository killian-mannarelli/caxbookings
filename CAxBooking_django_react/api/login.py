
import http.client
from pyexpat import model
from datetime import datetime
from django.shortcuts import redirect
from django.http import HttpResponse, JsonResponse
# import the Users model
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .models import Users




def check_db_if_user_exist(username):
    """Check if the user is already present in the database"""
    UserL = Users.objects.filter(username=username)
    if(len(UserL) == 0):
        return False
    else:
        return True

def login_verify(request, *args, **kwargs):
    if(request.method == 'OPTIONS'):
        # response to the preflight request
        response = HttpResponse(status=200)
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'POST'
        response['Access-Control-Allow-Headers'] = 'accept, content-type'
        return response

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        if(check_db_if_user_exist(username)):
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({'status': 'ok', 'username': username})
                
           
            return HttpResponse(status=401)
            
        code = authentificate_using_cumulus(username=username, password=password)
        if code == 200 or code == 302:
            # check the users to see if they exist
            # if not add them
            UserL = Users.objects.filter(username=username)
            if(len(UserL) == 0):
                userDB = Users.objects.create(username=username, admin_level=0)
                # create a new django user
                authuser = User.objects.create_user(
                    username=username, password=password, email=username, 
                    first_name=username, last_name=username, is_staff=False, is_superuser=False, is_active=True, 
                    date_joined=datetime.now(), last_login=datetime.now())
                authuser.save()
                login(request, authuser)
                userDB.save()


            return JsonResponse({'status': 'ok', 'username': username})
        elif code == 500:
            return JsonResponse({'status': 'error', 'message': 'Wrong username or password'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Something went wrong'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Something went wrong'})


def authentificate_using_cumulus(username, password):

    conn = http.client.HTTPSConnection("cumulus01.hs-woe.de")

    headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    payload = "OWASP_CSRFTOKEN=V7B0-LCPT-S44X-JNYX-J2Y5-CV8V-H85V-4OPB&user=" + \
        str(username)+"&password="+str(password)+"&encoding=UTF-8&server="
    print(payload)

    conn.request("POST", "/cwc/catalog", payload, headersList)
    response = conn.getresponse()
    result = response.read()
    return response.status
