import http.client
from pyexpat import model
from datetime import datetime
from django.shortcuts import redirect
from django.http import HttpResponse, JsonResponse
# import the Users model
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .models import Users
import requests



 
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
                SSOLogin(request, username, password)
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
                SSOLogin(request, username, password)
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

def SSOLogin(request, username, password):
    reqUrl = "https://sciauth-core.scientia.com/issue/oauth?response_type=token&client_id=JADEHS_38649741103712&redirect_uri=https%3A%2F%2Frbs.jade-hs.de%2F&scope=50D3EB5E-6BD2-44F1-830C-F5725CAF7F49"

    headersList = {
    "Accept": "*/*",
    "Content-Type": "application/x-www-form-urlencoded" 
    }

    payload = ""

    response = requests.request("GET", reqUrl, data=payload,  headers=headersList, allow_redirects=False)

    cookiesfortheend = response.cookies
    new_link = response.headers['Location']
    response = requests.request("GET", new_link, data=payload,  headers=headersList, allow_redirects=False) 



    cookies2 = {"JSESSIONID": str(response.cookies.__getitem__('JSESSIONID'))}





    verify_link = "https://idp.hs-woe.de/idp/profile/SAML2/Redirect/SSO?execution=e1s1"




    response = requests.request("GET", verify_link, data=payload,  headers=headersList, cookies=cookies2)



    csrf = response.text.split('<input type="hidden" name="csrf_token" value="')[1].split('" />')[0]

    payload = "j_username="+username+"&j_password="+password+"&csrf_token="+csrf+"&_eventId_proceed="

    response = requests.request("POST", verify_link, data=payload,  headers=headersList  , cookies=cookies2)

    #find the RelayState and the SAMLResponse
    #same way as csrf
    RS = response.text.split('<input type="hidden" name="RelayState" value="')[1].split('"/>')[0]
    SAML = response.text.split('<input type="hidden" name="SAMLResponse" value="')[1].split('"/>')[0]

    #replace every utf 8 character in SAML with their hex value
    SAML = SAML.replace('%', '%25')
    SAML = SAML.replace('+', '%2B')
    SAML = SAML.replace('/', '%2F')
    SAML = SAML.replace('=', '%3D')
    SAML = SAML.replace('?', '%3F')
    SAML = SAML.replace('&', '%26')
    SAML = SAML.replace(' ', '%20')
    SAML = SAML.replace('#', '%23')
    SAML = SAML.replace('<', '%3C')
    SAML = SAML.replace('>', '%3E')
    SAML = SAML.replace('"', '%22')
    SAML = SAML.replace('\n', '%0A')
    SAML = SAML.replace('\r', '%0D')
    SAML = SAML.replace('\t', '%09')



    #print(SAML)

    cookiejarend = {"TiPMix": str(cookiesfortheend.__getitem__('TiPMix')), "x-ms-routing-name": str(cookiesfortheend.__getitem__('x-ms-routing-name'))}


    SAML_Link = "https://sciauth-core.scientia.com/Authentication/SamlPost"

    payload = "RelayState="+str(RS)+"&SAMLResponse="+str(SAML)


    response = requests.request("POST", SAML_Link, data=payload, headers=headersList, cookies=cookiejarend , allow_redirects=False)


    response = requests.request("GET", reqUrl, headers=headersList, allow_redirects=False, cookies=response.cookies)

    

    #extract the token
    token = response.headers['Location'].split('access_token=')[1].split('&')[0]

    #put the token in the session
    request.session['token'] = str(token)

    #print(request.session['token'])
    

