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
<!--     - pipenv packages :
        - django version=4.0.4 
        - djangorestframework version=3.13.1
        - mysqlclient version=2.1.0
        - requests version=2.27.1
        - python-dateutil version=2.8.2 
-->

- frontend :
    - NodeJs version=17.9.0
    - npm version=8.5.5
```    - npm dependencies :        
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
### Django architecture
The project architecture is as follow :
```
├──CaxBooking_django_react/
|   ├──api/
|   |   ├──models.py
|   |   ├──views/
|   |   ├──urls.py
|   |   | ...
|   ├──frontend/
|   |   ├──src/
|   |   |   ├──component/
|   |   |   |   ...
|   |   |   ├──index.js
|   ├──CAxBooking_django_react/
|   |   ├──settings.py
|   |   | ...
|   ├──manage.py
|   | ... 
```
### Django manage
### React  

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation


## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
