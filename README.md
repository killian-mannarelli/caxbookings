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

## General Info
This project is a website project to allow students to book computers, it also allows teachers and other admin to monitor the rooms efficiency through various statistics

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
        ├──  python-dateutil version=2.8.2 
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

To setup the project in dev you need to be located in the `/CAxBooking_django_react/frontend` folder and run

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

This part is just an very large overview of Django/DjangoRestAPI's frameworks, it is highly recommended to check the documentations of both of those to understand the project structure a little better.

#### Django architecture

The main project structure is as follow :
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

The projects settings are in the `CAxBooking_django_react/CAxBooking_django_react/` folder there you have the `settings.py` file that alllows you to change settings like the different apps installed in the Django project and the connections informations of the database.

Then the two other folders are apps we are using one for the backend(`api`) and another for the frontend(`frontend`)

In the frontend app a ReactJs project was implemented and almost none of the generated files were modified except for the urls

#### Django manage

There are different commads that you can use with the `manage.py` file, the one that are the most used are `python3 manage.py makemigration` to setup for the different migrations that might have appened in the project, and the `python3 manage.py migrate` that proceeds to make the different migrations

### React  


