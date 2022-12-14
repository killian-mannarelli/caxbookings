# CAxBooking




## Table of content
1. [General Info](#general-info)
2. [Technologies](#technologies)
3. [Setup](#setup)
    - [Setup-Dev](#setup-dev)
    - [Setup-Prod](#setup-prod)
4. [How to use](#how-to-use)
    - [Django architecture](#django-architecture)
    - [Django manage](#django-manage)
    - [React](#react)
    - [Contact](#contact)


## General Info
This project is a website project to allow students to book computers, it also allows teachers and other admin to monitor the room's efficiency through various statistics

    Important : as the server on which the database is running, and we are connected to is 2 hours early, some of the times durations have hard-coded offsets (for example: the event to change the state of a booking).

## Technologies

- database : mysql 
- backend : 
    - python version=3.8
    - pipenv version=11.9.0
    - pipenv packages :
```
        ├──  django version=4.0.4 
        ├──  djangorestframework version=3.13.1
        ├──  mysqlclient version=2.1.0
        ├──  requests version=2.27.1
        └──  python-dateutil version=2.8.2 
```

- frontend :
    - NodeJs version=17.9.0
    - npm version=8.5.5
    - npm dependencies :        
```    
        ├── @babel/core@7.17.9
        ├── @babel/preset-env@7.16.11
        ├── @babel/preset-react@7.16.7
        ├── @date-io/moment@2.13.1
        ├── @emotion/react@11.9.0
        ├── @emotion/styled@11.8.1
        ├── @mui/icons-material@5.6.2
        ├── @mui/material@5.6.4
        ├── @mui/styled-engine@5.6.1
        ├── @mui/x-data-grid@5.10.0
        ├── @mui/x-date-pickers@5.0.0-alpha.1
        ├── axios@0.26.1
        ├── babel-loader@8.2.4
        ├── concurrently@6.5.1
        ├── css-loader@6.7.1
        ├── moment@2.29.3
        ├── react-chartjs-2@4.1.0
        ├── react-dom@17.0.2
        ├── react-router-dom@5.3.1
        ├── react@17.0.2
        ├── style-loader@3.3.1
        ├── webpack-cli@4.9.2    
        └── webpack@5.72.0
```

## Setup

### Setup-Dev

To set up the project in dev you need to be located in the `/CAxBooking_django_react/frontend` folder and run

```
npm run init
```
then run 
```
npm run serve
```
and both the django server and the node server should be running. 

### Setup-Prod 
`TODO`

## How to use 



### Django in general

This part is just a very large overview of Django/DjangoRestAPI's frameworks, it is highly recommended checking the [documentation](https://docs.djangoproject.com/en/4.0/) of both of those to understand the project structure a little better.

#### Django architecture

The main project structure is as follows :
```
├──CaxBooking_django_react/
|   ├──api/
|   |   ├──models.py
|   |   ├──views/
|   |   ├──urls.py
|   |   └── ...
|   ├──frontend/
|   |   ├──src/
|   |   |   ├──component/
|   |   |   |  └── ...
|   |   |   └──index.js
|   |   └── ...
|   ├──CAxBooking_django_react/
|   |   ├──settings.py
|   |   └── ...
|   ├──manage.py
└── └── ... 
```

The projects settings are in the `CAxBooking_django_react/CAxBooking_django_react/` folder there you have the `settings.py` file that allows you to change settings like the different apps installed in the Django project and the connections information of the database.

Then the two other folders are apps we are using one for the backend(`api`) and another for the frontend(`frontend`)

In the frontend app a ReactJs project was implemented and almost none of the Django generated files were modified except for `urls.py`.

The api folder deals with all of the backend of the website, in the models folder you have all of the models used in the rest of the project.

In the views folder there is a file for each of the 4 main tables in the database/models of the project, `Bookings`, `Rooms`, `Users` `Computers`. 
In these files you can find all of the api requests that are used by the website while running.
To format the responses of the views, we use the `serializers.py` file.

#### Django manage

There are different commands that you can use with the `manage.py` file, the one that are the most used are `python3 manage.py makemigration` to set up for the different migrations that might have happened in the project, and the `python3 manage.py migrate` that proceeds to make the different migrations

### DataBase

The database is a simple MySQL database with a few tables, and one event used to update the bookings status every minutes.
The database is connected to Django via the settings.py file, each and every model from the models.py file are translatable in a database table.

### React  
React is a JavaScript component based library, for more info check the [documentation](https://reactjs.org/docs/getting-started.html).

The project only has 4 pages :

* the Connection page
* the "Main Page" page
* the Room page
* and the Admin page

## Contact
This project was developed in the course of an internship at Jade Hochschule, by two students, if for maintenance purpose, or just to understand better, please contact us here :
 - gabin.charasson@gmail.com
 - killian.mannarelli@gmail.com


