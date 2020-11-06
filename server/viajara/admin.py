from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Place, List, ListEntry, Photo
# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Place)
admin.site.register(List)
admin.site.register(ListEntry)
admin.site.register(Photo)
