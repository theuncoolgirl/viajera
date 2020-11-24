from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
import os
from .models import Place
from .serializers import MyTokenObtainPairSerializer, PlaceSerializer, UserSerializer


class ObtainTokenPair(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class UserCreate(APIView):
    # REST_FRAMERWORK's permissions defaults are for views to be accessible
    # only to authenticated users, so the permission must be set manually to
    # `AllowAny` so that an unauthenticated user can actually sign up.
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    # create a new user
    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            # the UserSerializer has a `create()` method, so
            # `serializer.save()` can be used to create a User object. Could
            # be used with `update()` methods as well.
            user = serializer.save()
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HelloWorldView(APIView):
    def get(self, request):
        return Response(data={"hello": "world"}, status=status.HTTP_200_OK)


class LogoutAndBlacklistRefreshToken(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class PlaceView(APIView):
    def get(self, request, *args, **kwargs):
        places = Place.objects.all()
        serializer = PlaceSerializer(places, many=True)
        return Response(serializer.data)


class PlaceSingleView(APIView):
    def put(self, request, *args, **kwargs):
        print(request.data)
        try:
            place = Place.objects.get(place_id=request.data.place_id)
        except Place.DoesNotExist:  # Be explicit about exceptions
            place = None
        return place


class PlaceCreate(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PlaceSerializer(data=request.data)
        if serializer.is_valid():
            place = serializer.save()
            serializer = PlaceSerializer(place)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListEntryCreate(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ListEntrySerializer(data=request.data)
        if serializer.is_valid():
            list_entry = serializer.save()
            serializer = ListEntrySerializer(list_entry)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class PlaceView(generics.ListCreateAPIView):
#     queryset = Place.objects.all()
#     serializer_class = PlaceSerializer

    # def post(self, request):
    #     serializer = PlaceSerializer(data=request.data)
    #     if serializer.is_valid(raise_exception=True):
    #         serializer.save()
    #         return Response(serializer.data)
