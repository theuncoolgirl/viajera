# Django-React App Setup
## Structure and Setup
We are building two separate apps that will ultimately be connected - the React frontend client and the Django API backend. In the backend, we'll create a RESTful API using Django (with methods like GET, POST, etc). In the frontend, we'll hit this API using React. 



### Create Project Directory and Install Django
This walkthrough assumes you already have `Python3`, `pip`, and `virtualenv` installed on your machine. 
1. Create a project directory and `cd` into it.  
    ```
    mkdir projectDirectory && cd projectDirectory
    ```

1. Install Django using the  `pip` package manager:
    ```
    python3 -m venv env
    source env/bin/activate
    pipenv install django djangorestframework djangorestframework-simplejwt
    ```
1. Verify Django is installed:
    ```
    python -m django --version
    ```

### Create a Django Project
According to the official Django documentation, a Django project is "a collection of settings for an instance of Django, including database configuration, Django-specific options and application-specific settings". You'll need to create a Django project as a part of the initial setup of your project. 
1. Create a Django project - this will generate a subdirectory named the same as your `projectName` for the backend. Some folks like to call this `server`. 
    ```
    django-admin startproject projectName
    ```
    This will auto-generate a subdirectory named `projectName` with the following structure:
    ```
    projectName/
        manage.py
        projectName/
            __init__.py
            settings.py
            urls.py
            asgi.py
            wsgi.py
    ```
    - `manage.py` - command-line utility that allows you to interact with the Django project. 
    - `/projectName/projectName` subdirectory is the Python package for your project. 
    - `__init__.py` - empty file that alerts Python that the `/projectName/projectName` directory is a Python package. 
    - `asgi.py` - entry-point for ASGI-compatible web servers to serve your project
    - `settings.py` - config for the project
    - `urls.py` - URL dispatcher for your project
    - `wsgi.py` - entry-point for WSGI-compatible web servers to serve your project

1. Test that your Django project works by attempting to run the development server:
    ```
    python manage.py runserver
    ```
    You will see output similar to:
    ```
    Watching for file changes with StatReloader
    Performing system checks...

    System check identified no issues (0 silenced).

    You have 18 unapplied migration(s). Your project may not work properly until you apply the migrations for app(s): admin, auth, contenttypes, sessions.
    Run 'python manage.py migrate' to apply them.
    November 04, 2020 - 16:30:17
    Django version 3.1.3, using settings 'server.settings'
    Starting development server at http://127.0.0.1:8000/
    Quit the server with CONTROL-C.
    ```
    Navigate to `http://127.0.0.1:8000/` to confirm everything is running. 

### Create a `.env` to Save Environmental Variables
1. Install `python-dotenv` into your virtual environment:
    ```
    pip install python-dotenv
    ```
1. Create an `.env` in in the same folder as your `settings.py` file and save your environment variables to it:
    ```python
    SECRET_KEY='secretkey'
    OTHER_SECRET='somethingelse'
    ```
1. Add the following to your `settings.py` file in order to prase the key/value pair from the `.env` file as system environment variables:
    ```python
    from dotenv import load_dotenv
    load_dotenv()
    ```
1. Add the following code to your `settings.py` to use `os` to access these system environment variables:
    ```python
    import os
    SECRET_KEY = os.getenv("SECRET_KEY")
    ```
1. In your `wsgi.py` file in your project/backend folder, set your environment variables before the code that loads your website:
    ```python
    import os #add this

    from dotenv import load_dotenv #add this
    from django.core.wsgi import get_wsgi_application

    project_folder = os.path.expanduser('~/my-project-directory') #add this
    load_dotenv(os.path.join(project_folder, '.env')) #add this

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

    application = get_wsgi_application()
    ```
1. 

### Create a Django App
1. `cd` into the project folder and run the following to create your app:
    ```
    python manage.py startapp appName
    ```
1. The following folder structure will be generated in your project folder to house your application:
    ```
    appName/
        __init__.py
        admin.py
        apps.py
        migrations/
            __init__.py
        models.py
        tests.py
        views.py
    ```
1. Register the app in your `INSTALLED_APPS` in `settings.py` in the project directory:
    ```python
    INSTALLED_APPS = [
        'django.contrib.admin',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',
        'appName' # add this
    ]
    ```



Front-End
https://www.saaspegasus.com/guides/modern-javascript-for-django-developers/client-server-architectures/

1. In that project directory, make a `/client` directory for the front end
    ```
    mkdir client
    ```
1. 