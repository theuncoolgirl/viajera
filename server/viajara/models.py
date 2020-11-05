from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.


class User(AbstractUser):
    pass


class Place(models.Model):
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    latitude = models.DecimalField(max_digits=6, decimal_places=3)
    longitude = models.DecimalField(max_digits=6, decimal_places=3)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False)


class List(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False)


class ListEntry(models.Model):
    place_id = models.ForeignKey(Place, on_delete=models.CASCADE)
    list_id = models.ForeignKey(List, on_delete=models.CASCADE)
    notes = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False)


class Photo(models.Model):
    place_id = models.ForeignKey(
        Place, on_delete=models.SET_NULL, blank=True, null=True)
    list_entry_id = models.ForeignKey(
        ListEntry, on_delete=models.SET_NULL, blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    img_url = models.URLField(max_length=300)
    description = models.CharField(max_length=200)
    date = models.DateField(auto_now=False, auto_now_add=False)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False)
