from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import MyTokenObtainPairSerializer, UserSerializer


class ObtainTokenPair(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class UserCreate(APIView):
    # REST_FRAMERWORK's permissions defaults are for views to be accessible
    # only to authenticated users, so the permission must be set manually to
    # `AllowAny` so that an unauthenticated user can actually sign up.
    permission_classes = (permissions.AllowAny,)

    # this view just has a POST endpoint to create a new user
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
