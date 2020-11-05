# Django-React App Setup
## Backend Setup
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
    pipenv install python-dotenv
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

## Database Setup
### Install `pg_config` and `psycopg2-binary`
1. Check whether or not `pg_config` is already installed on your OS (this is a requirement for using `psycopg2-binary`):
    ```
    pg_config
    ```
1. If it is not already installed, install it:
    ```
    export PATH=/usr/pgsql-12/bin/:${PATH}
    ```
    ```
    which pg_config
    ```
1. Install `psycopg2-binary` in your virtual environment, which is a database binding for PostgreSQL:
    ```
    pipenv install psycopg2-binary
    ```

### Update `settings.py`
1. Create your user and database in `psql` and update your `.env` accordingly with values for the user, password, and database name. 
1. Update the `DATABASE` key in `settings.py` to the following so that it knows you plan to use PostgreSQL and that your database info has been stored in your `.env`:
    ```python
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv("DATABASE_NAME"),
            'USER': os.getenv("DATABASE_USER"),
            'PASSWORD': os.getenv("DATABASE_PASSWORD"),
            'HOST': os.getenv("DATABASE_HOST"),
            'PORT': os.getenv("DATABASE_PORT"),
        }
    }
    ```
### Create A Custom User Model
1. Create a custom user model. Django has a built-in `User` model already established, but you should *always* create a new custom user model when starting your project, because this will allow you to update/customize the model in the future. 
    ```python
    from django.contrib.auth.models import AbstractUser

    class User(AbstractUser):
        pass
    ```
1. Register the new custom user in `admin.py`:
    ```python
    from django.contrib import admin
    from django.contrib.auth.admin import UserAdmin
    from .models import User

    admin.site.register(User, UserAdmin)
    ```
1. Configure your new `User` custom model as `AUTH_USER_MODEL` in `settings.py`:
    ```python
    # Custom user model
    AUTH_USER_MODEL = "viajara.User"
    ```
### Create Your Models
1. Create a model for each of your tables in `models.py`. Note that Django has some pre-built models such as the `User` model which you do not have to create yourself. Example:
    ```python
    class Place(models.Model):
        created_by = models.ForeignKey(User, on_delete=models.SET_NULL)
        latitude = models.DecimalField(max_digits=6, decimal_places=3)
        longitude = models.DecimalField(max_digits=6, decimal_places=3)
        created_at = model.DateTimeField(auto_now=False, auto_now_add=True)
        updated_at = model.DateTimeField(auto_now=True, auto_now_add=False)
    ```


## Frontend Setup
https://www.saaspegasus.com/guides/modern-javascript-for-django-developers/client-server-architectures/

1. In that project directory, make a `/client` directory for the front end
    ```
    mkdir client
    ```
1. 