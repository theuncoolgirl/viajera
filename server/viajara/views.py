from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
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


class PlaceCreate(generics.ListCreateAPIView):
    # permission_classes = (permissions.AllowAny,)
    # authentication_classes = ()
    queryset = Place.objects.all()
    serializer_class = PlaceSerializer

    # def get(self, request):
    # places = Place.objects.all()
    # print(places)
    # return Response(data={"hello": "world"}, status=status.HTTP_200_OK)
    # places = [{
    #     "id": place.id,
    #     "created_by": place.created_by,
    #     "latitude": place.latitude,
    #     "longitude": place.longitude,
    #     "created_at": place.created_at,
    #     "updated_at": place.updated_at
    # } for place in Place.objects.all()]
    # return Response(places)
