cors: https://stackoverflow.com/questions/44037474/cors-error-while-consuming-calling-rest-api-with-react

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
### Create Your Models and Migrate
1. Create a model for each of your tables in `models.py`. Note that Django has some pre-built models such as the `User` model which you do not have to create yourself. Example:
    ```python
    class Place(models.Model):
        created_by = models.ForeignKey(User, on_delete=models.SET_NULL)
        latitude = models.DecimalField(max_digits=6, decimal_places=3)
        longitude = models.DecimalField(max_digits=6, decimal_places=3)
        created_at = model.DateTimeField(auto_now=False, auto_now_add=True)
        updated_at = model.DateTimeField(auto_now=True, auto_now_add=False)
    ```
1. Create your migrations in your virtual environment by running the following. `makemigrations` tells Django that you've updated something in your models, so you'll need to run this everytime you make an update before re-migrating. 
    ```
    python projectDirectory/manage.py makemigrations appName
    ```
1. Run your migrations in your virtual environment by running:
    ```
    python projectDirectory/manage.py migrate
    ```
1. Go ahead and set up a demo/super user while you are at it. Run this and follow the prompts to create your superuser:
    ```
    python projectDirectory/manage.py createsuperuser
    ```
1. If you want to make updates to your models in the future, do the following:
    - change you models in `models.py`
    - run `python manage.py makemigrations`
    - run `python manage.py migrate`

## Auth Setup
### Set up DRF and Auth
Only authenticated viewers will be able to access views, and they will authenticate using JWTAuthentication from the `simplejwt` package we previously installed. 
1. Confiure DRF + DRF Simple JWT by adding the following to `settings.py`:
    ```python
    # add rest_framework to INSTALLED_APPS
    INSTALLED_APPS = [ ... 'rest_framework'  ] 
    
    # add configs for REST_FRAMEWORK and SIMPLE_JWT
    REST_FRAMEWORK = { 
    'DEFAULT_PERMISSION_CLASSES': ( 'rest_framework.permissions.IsAuthenticated', ),
    'DEFAULT_AUTHENTICATION_CLASSES': ( 'rest_framework_simplejwt.authentication.JWTAuthentication', ), 
    } 
    SIMPLE_JWT = { 
        'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5), 
        'REFRESH_TOKEN_LIFETIME': timedelta(days=14), 
        'ROTATE_REFRESH_TOKENS': True, 
        'BLACKLIST_AFTER_ROTATION': False, 
        'ALGORITHM': 'HS256', 
        'SIGNING_KEY': SECRET_KEY, 
        'VERIFYING_KEY': None, 
        'AUTH_HEADER_TYPES': ('JWT',), 
        'USER_ID_FIELD': 'id', 
        'USER_ID_CLAIM': 'user_id', 
        'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',), 
        'TOKEN_TYPE_CLAIM': 'token_type', 
    }
    ```
    - Refresh tokens last 14 days are are used to get Access tokens, which last 5 minutes. A view can only be accessed by a user with a valid Access token, otherwise the user will receive a 401 'unauthorized' error. 

### Authenticating and getting Refresh and Access tokens
1. Import `include` and add an `api/` path in your `urls.py` file in the project directory. Replace `app_name` with the name of your app directory:
    ```python
        from django.urls import path, include # add include to this import
        
        urlpatterns = [
        path('admin/', admin.site.urls),
        path('api/', include('app_name.urls')) # add this
    ]
    ```
1. In your application folder, add a new `urls.py` file so that we can use the twin views supplied by DRF Simple JWT to obtain token pairs and refresh tokens:
    ```python
    from django.urls import path
    from rest_framework_simplejwt import views as jwt_views

    urlpatterns = [
        path('token/obtain/', jwt_views.TokenObtainPairView.as_view(), name='token_create'),
        # override sjwt stock token
        path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    ]
    ```
1. Test what you've implemented so far by using CURL with the superuser credentials you set above:
    ```
    $ curl --header "Content-Type: application/json" -X POST http://127.0.0.1:8000/api/token/obtain/ --data '{"username":"djsr","password":"djsr"}'
    ```
1. You should see something similar to the below returned if successful:
    ```
    {"refresh":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTYwNTgyMjkyNSwianRpIjoiY2Q2ZDhkOWJjMGUyNDE4MDgzNjU3NjI4NTVhYmI5ZDUiLCJ1c2VyX2lkIjoxfQ.nE9TAGGfoIbMKdysksBttpGTn895WP8vwfhVdjf-TAg","access":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjA0NjEzNjI1LCJqdGkiOiJmMDllZmE5YWU5ZjE0M2ExYWNhMjkxYTAyNWRjMmJkZCIsInVzZXJfaWQiOjF9.bR-OFklxLDy0DBuR-Jr8m_f2shko7rUzAaSJ-wxGfw8"}
    ```
1. Now take that refresh token and check to see if it generates an access token by using CURL:
    ```
    curl --header "Content-Type: application/json" -X POST http://127.0.0.1:8000/api/token/refresh/ --data '{"refresh":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTYwNTgyMjkyNSwianRpIjoiY2Q2ZDhkOWJjMGUyNDE4MDgzNjU3NjI4NTVhYmI5ZDUiLCJ1c2VyX2lkIjoxfQ.nE9TAGGfoIbMKdysksBttpGTn895WP8vwfhVdjf-TAg","access":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjA0NjEzNjI1LCJqdGkiOiJmMDllZmE5YWU5ZjE0M2ExYWNhMjkxYTAyNWRjMmJkZCIsInVzZXJfaWQiOjF9.bR-OFklxLDy0DBuR-Jr8m_f2shko7rUzAaSJ-wxGfw8"}'
    ```
    - You should have an `access` token object returned if successful. If you go over to jwt.io, you can plug in either your refresh or access token and see the header and payload. 
### Create the Obtain Token Serializer and View
1. Add a serializer to the `serializers.py` file for the token. More on serializers will be described below:
    ```python
    from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

    class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
        @classmethod
        def get_token(cls, user):
            token = super(MyTokenObtainPairSerializer, cls).get_token(user)
            return token
    ```
1. Add a corresponding view in the `views.py` file for the token:
    ```python
    from rest_framework_simplejwt.views import TokenObtainPairView
    from rest_framework import status, permissions
    from .serializers import MyTokenObtainPairSerializer

    class ObtainTokenPair(TokenObtainPairView):
        permission_classes = (permissions.AllowAny,)
        serializer_class = MyTokenObtainPairSerializer
    ```
1. Replace the packaged entry in `urls.py` in your app directory with the following to utilize your new view for `token/obtain/`:
    ```python
    from django.urls import path
    from rest_framework_simplejwt import views as jwt_views
    from .views import ObtainTokenPair

    urlpatterns = [
        path('token/obtain/', ObtainTokenPair.as_view(), name='token_create'),
        path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    ]
    ```
1. Test everything out again with CURL to make sure you are still receiving the token:
    ```
    curl --header "Content-Type: application/json" -X POST http://127.0.0.1:8000/api/token/obtain/ --data '{"username":"username","password":"passwordd"}'
    ```
### Build out a User Serializer
1. Create a `serializers.py` file in your app folder, and add the following code. Serializers are used to convert data in your models into usable Python data structures, which can be rendered into JSON to be used in React on the client side:
    ```python
    from rest_framework import serializers
    from .models import User


    class UserSerializer(serializers.ModelSerializer):
        email = serializers.EmailField( required=True )
        username = serializers.CharField()
        first_name = serializers.CharField()
        last_name = serializers.CharField()
        password = serializers.CharField(min_length=8, write_only=True)
        
        class Meta:
            model = User
            fields = ('email', 'username', 'first_name', 'last_name', 'password')
            extra_kwargs = {'password': {'write_only': True}}
        
        def create(self, validated_data):
            password = validated_data.pop('password', None)
            instance = self.Meta.model(**validated_data) # as long as the fields are the same, we can just use this
            if password is not None:
                instance.set_password(password)
            
            instance.save()
            
            return instance
        ```
1. Update the corresponding view in `views.py`:
    ```python
    from django.shortcuts import render
    from rest_framework_simplejwt.views import TokenObtainPairView
    from rest_framework import status, permissions
    from rest_framework.response import Response
    from rest_framework.views import APIView
    from .serializers import MyTokenObtainPairSerializer, UserSerializer


    class ObtainTokenPair(TokenObtainPairView):
        serializer_class = MyTokenObtainPairSerializer

    class UserCreate(APIView): 
        permission_classes = (permissions.AllowAny,)

        def post(self, request, format='json'):
            serializer = UserSerializer(data=request.data)

            if serializer.is_valid():
                user = serializer.save()

                if user:
                    json = serializer.data

                    return Response(json, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    ```
    Some notes:
        -  `REST_FRAMERWORK`'s permissions defaults in `settings.py` are for views to be accessible only to authenticated users, so the permission must be set manually to `AllowAny` so that an unauthenticated user can actually sign up.
        - this view just has a POST endpoint to create a new user
        - the `UserSerializer` has a `create()` method, so `serializer.save()` can be used to create a User object. Could be used with `update()` methods as well. 
1. Add relevant path to `urls.py` to create a new user:
    ```python
    from .views import ObtainTokenPair, UserCreate  # add UserCreate class to import

    # urlpatterns = [ ...
    path('user/create/', UserCreate.as_view(), name="create_user"),
    # ... ]
    ```
1. Use CURL to test to make sure everything works!
    ```
    curl --header "Content-Type: application/json" -X POST http://127.0.0.1:8000/api/user/create/ --data '{"email":"ichiro@mariners.com","username":"ichiro1","password":"konnichiwa","first_name":"first","last_name":"last"}'
    ```
1. You should receive a response similar to:
    ```
    {"email":"ichiro@mariners.com","username":"ichiro1","first_name":"first","last_name":"last"}
    ```

## React Frontend
### Install React inside Django project as standalone app
1. In your Django project, make a new Django app to hold React:
    ```
    python manage.py startapp frontend
    ```
1. In `frontend`, make a `templates` directory, and then make a `frontend` directory inside the `templates` directory. Make an `index.html` file here. This will be the base template for React - prepare it like a standard Django base template for the time being:
    ```html
    <!DOCTYPE html>
    <html> {% load static %}
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="{% static 'frontend/style.css' %}">
        <title>DRF + React = Winning the game</title>
    </head>
    <body>
        <div id="root" class="content"> This will be the base template. </div>
    </body>
    </html>
    ```
1. Inside the app-level `frontend` directory, create a `static` directory, and another `frontend` folder inside the `static` directory. Create a `style.css` file and put any sort of basic styling here for now. 
1. In your project folder, add the following path to your `urls.py ` file:
    ```python
    urlpatterns = [ ... 
    path('', include('frontend.urls')) # add this
    ]
    ```
    - make sure to add it to the end, so that anything that does **not** match Django URLS will be handled by the frontend. This lets us use React's router to manage frontend views while still hosting it on the same server, avoiding CORS madness. 
1. In your `frontend` directory, add the following to `views.py`:
    ```python
    from django.shortcuts import render
    
    # Create your views here.
    def index(request): 
        return render(request, 'frontend/index.html', context=None)
    ```
1. In your `frontend` directory, add this view to the frontend URLS. This will catch both an empty URL ('') and every other URL:
    ```python
    urlpatterns = [
        path('', index_view), # for the empty url
        url(r'^.*/$', index_view) # for all other urls
    ]
    ```
1. Run your server again and see if you have `This will be the base template` rendered at both `http://127.0.0.1/` and `http://127.0.0.1/anythingelse/`. Django by default appends a `/` to the end of each URL, which is why we have the `/$` at the end of the regex above. 

### Set up Babel and Webpack in the frontend app
1. We can't use Create React App here due to oue configuration with Django, so we'll need to build our own toolchain. 
1. Use `npm init` to create the `package.json` file in the root folder of the app (where the `Pipfile` is). 
1. Within the `frontend` app directory, create a `src` directory - this will hold all of our React Components. 
1. Within the `frontend/static/frontend` directory, create a `public` directory. 
1. Add the following to the bottom of the `index.html` file. This intersects django and react. When compiled, the React components will be contained in main.js. Django will serve index.html, which will load main.js:
    ```html
    <script type="text/javascript" src="{% static 'frontend/public/main.js' %}"></script>
    ```
1. Install `@babel/core`, `@babel/preset-env`, and `@babel-preset-react`. Babel takes the code we will write and converts it to JavaScript that can be read by browsers. 
    ```
    npm install --save-dev @babel/core@7.4.5 @babel/preset-env@7.4.5 @babel/preset-react@7.0.0
    ```
1. Create a `.babelrc` folder in the project root, next to `package.json` in order for us to properly use Babel, and insert the following code:
    ```
    { "presets": ["@babel/preset-env", "@babel/preset-react"] }
    ```
1. Install Webpack, whic is a bundler that takes our modules (our React components) and converts them into static assets that browsers can load:
    ```
    npm install --save-dev webpack webpack-cli babel-loader babel-loader@8.0.6 webpack-cli@3.3.4 webpack@4.35.0
    ```
1. Create a `webpack.config.js` file at the root (next to `package.json`) to contain our Webpack configuration. Paste in the following code:
    ```js
    const path = require('path');

    module.exports = {
        mode: "development",
        entry: path.resolve(__dirname, 'server/frontend/src/index.js'),
        // Webpack will find the start of our React app and bundle from there
        output: {
            // options related to how webpack emits results 
            // where compiled files go:
            path: path.resolve(__dirname, "server/frontend/static/frontend/public/"),
            // 127.0.0.1/static/frontend/public/ where static files are served from
            // (in production using a CDN, the pattern here would be
            // STATIC_PATH/{{path after emitting}} where STATIC_PATH is wherever your
            // Django project saves static files after running collectstatic):
            publicPath: "/static/frontend/public/",
            filename: 'main.js',
            // the same one we import in index.html
        },
        module: {
            // configuration regarding modules
            rules: [{
                // regex test to find js and jsx files
                test: /\.(js|jsx)?$/,
                // don't look in the node_modules/ folder
                exclude: /node_modules/,
                // for matching files, use the babel-loader
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/env"]
                    }
                },
            }],
        },
    };
    ```

### Setup React
1. Install React:
    ```
    npm install --save react react-dom react@16.8.6 react-dom@16.8.6
    ```
1. Create a `index.js` file inside your `src` directory - this is what renders the React App in place of the `root` element in `index.html`. 
    ```js
    import React from 'react'
    import { render } from 'react-dom'
    import App from './components/App';

    render(<App />, document.getElementById('root'));
    ```
1. Create a `component` directory inside the `src` directory and create a `App.js` file with the following placeholder:
    ```js
    import React, { Component } from "react";

    class App extends Component {
        render() {
            return (
                <div className="site">
                    <h1>Ahhh after 10,000 years I'm free. Time to conquer the Earth!</h1>
                </div>
            );
        };
    };

    export default App;
    ```
1. Add a `"build"` script to the `"scripts"` section of your `package.json` in order to use Webpack to compile manually (since we are not using the Webpack development server):
    ```json
    ...
    "scripts": {
        "build": "webpack --config webpack.config.js",
        ...
    },
    ...
    ```
1. Run the script above, and you should see a `main.js` file generated in the `public` directory, and new text served in the browser when you restart the server:
    ```
    npm run build
    ```

### Set up Routing
1. Install `react-router-dom`. React Router is a frontend routing library that allows you to control which components to display using the browser location:
    ```
    npm install react-router-dom@5.0.1
    ```
1. We'll be using `BrowserRouter`, which is the preferred choice when building an SPA or when the React app is backed by a dynamic server (which we have thanks to Django). In `index.js`, wrap the `App` component with a `BrowserRouter` component. It creates a React context that passes routing information down to all its descendent components.:
    ```js
    import {BrowserRouter} from 'react-router-dom'
    ...
    <BrowserRouter> 
        <App />
    </BrowserRouter>
    ...
    ```
1. Update the App component as follows: 
    ```js
    import React, { Component } from "react";
    import { Link, Route, Switch } from "react-router-dom";
    import { Login, Signup } from ".";

    class App extends Component {
        render() {
            return (
                <div className="site">
                    <main>
                        <h1>Ahhh after 10,000 years I'm free. Time to conquer the Earth!</h1>
                        <Switch>
                            <Route exact path={"/login/"} component={Login} />
                            <Route exact path={"/signup/"} component={Signup} />
                            <Route path={"/"} render={() => <div>Home again</div>} />
                        </Switch>
                    </main>
                </div>
            );
        };
    };

    export default App;
    ```
    - `Switch` allows us to switch out the components that are rendered based on the defined routes. 

Django serves index.html, which grabs main.js. All react components will be contained in main.js. Babel and Webpack will create and compile what is in main.js so that it can be properly served by index.html and viewed on browsers. 

### Create Other Serializers
1. Add a serializers for every model in your `serializers.py` file:
    ```python
    class PlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Place
        fields = ('id', 'created_by', 'latitude', 'longitude')
    ```


https://www.saaspegasus.com/guides/modern-javascript-for-django-developers/client-server-architectures/

1. In that project directory, make a `/client` directory for the front end
    ```
    mkdir client
    ```
1. 