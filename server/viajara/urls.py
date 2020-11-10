from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from .views import ObtainTokenPair, UserCreate, HelloWorldView

urlpatterns = [
    path('user/create/', UserCreate.as_view(), name="create_user"),
    path('token/obtain/', ObtainTokenPair.as_view(), name='token_create'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('hello/', HelloWorldView.as_view(), name='hello_world')
]
