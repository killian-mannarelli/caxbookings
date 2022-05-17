import csv
from http.client import HTTPResponse
import shutil
from django.contrib import admin
from django.http import HttpResponse, FileResponse
from .models import Bookings, Computers, Rooms
from django.contrib.auth.models import User
import os
from zipfile import ZipFile
from shutil import make_archive

def download_csv(request, queryset):

    model = queryset.model
    model_fields = model._meta.fields + model._meta.many_to_many
    field_names = [field.name for field in model_fields]

    # create an empty csv file called 'export.csv' in the current directory
    fileName = 'export' + model.__name__ + '.csv'
    
    with open(fileName, 'w', newline='') as response:
        # the csv writer
        writer = csv.writer(response, delimiter=";")
        # Write a first row with header information
        writer.writerow(field_names)
        # Write data rows
        for row in queryset:
            values = []
            for field in field_names:
                value = getattr(row, field)
                if callable(value):
                    try:
                        value = value() or ''
                    except:
                        value = 'Error retrieving value'
                if value is None:
                    value = ''
                values.append(value)
            writer.writerow(values)
        return response

def export_csv(request):
  #open the csv file that you want to export
  #find the file called export.csv in the current directory

  data_rooms = download_csv(request, Rooms.objects.all())
  data_bookings = download_csv(request, Bookings.objects.all())
  data_users = download_csv(request, User.objects.all())
  data_computers = download_csv(request, Computers.objects.all())
  root_dir = os.path.dirname(os.path.abspath(__file__))
  zipF = ZipFile('export.zip', 'w')
  zipF.close()
  #add export.csv to the zip file
  fileNames  = ["./exportRooms.csv", "./exportBookings.csv", "./exportUser.csv", "./exportComputers.csv"]

  with ZipFile('export.zip', 'a') as zip:
    for fileZip in fileNames:
        zip.write(fileZip)
        

  response = FileResponse(open('export.zip', 'rb'))
  response['Content-Type'] = 'application/zip'
  return response
