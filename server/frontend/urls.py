from django.urls import path
from django.conf.urls import url
from .views import index as index_view


urlpatterns = [
    path('', index_view),  # for empty '/' url
    url(r'^.*/$', index_view)  # for all other urls
]
