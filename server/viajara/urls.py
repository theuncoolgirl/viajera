from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from .views import ObtainTokenPair

urlpatterns = [
    path('token/obtain/', ObtainTokenPair.as_view(), name='token_create'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]
