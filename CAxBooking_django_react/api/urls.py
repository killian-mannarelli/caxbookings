from django.urls import path
from .views import TodoListView
from .login import loginverify
urlpatterns = [
    path('todo', TodoListView.as_view()),
    #create a path with loginverify and fill the arguments
    path('login/', loginverify),
   
]