
import http.client

from django.shortcuts import redirect
from django.http import HttpResponse, JsonResponse

def loginverify(request, *args, **kwargs):
    if(request.method == 'OPTIONS'):
        #response to the preflight request
        response = HttpResponse(status=200)
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'POST'
        response['Access-Control-Allow-Headers'] = 'accept, content-type'

        return response

        
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        code = authentificate(username=username, password=password)
        if code == 200 or code == 302:
            return JsonResponse({'status': 'ok', 'username' : username})
        elif code == 500:
            return JsonResponse({'status': 'error', 'message' : 'Wrong username or password'})
        else:
            return JsonResponse({'status': 'error', 'message' : 'Something went wrong'})
    else:
        return JsonResponse({'status': 'error', 'message' : 'Something went wrong'})
        
            



   

def authentificate(username, password):


    conn = http.client.HTTPSConnection("cumulus01.hs-woe.de")

    headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/x-www-form-urlencoded" 
    }

    payload = "OWASP_CSRFTOKEN=V7B0-LCPT-S44X-JNYX-J2Y5-CV8V-H85V-4OPB&user="+str(username)+"&password="+str(password)+"&encoding=UTF-8&server="
    print(payload)

    conn.request("POST", "/cwc/catalog", payload, headersList)
    response = conn.getresponse()
    result = response.read()
    return response.status