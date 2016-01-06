from __future__ import unicode_literals

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import login, logout

from dbapi.models.auth import CodaUser, CodaGroup
from dbapi.serializers.auth import CodaUserSerializer, CodaLoginSerializer
from dbapi.views.error import ErrorResponse


def login(username, password, request) :
    user = authenticate(username=username, password=password)
    if user is not None :
        if user.is_active :
            login(request,user)
            return Response(user.data, status=status.HTTP_202_ACCEPTED)
        else :
            return ErrorResponse("Account Disabled", status=status.HTTP_403_FORBIDDEN)
    else :
        return ErrorResponse("Bad Credentials", status=status.HTTP_403_FORBIDDEN)
    

class RegisterUser(APIView) :
    def post(self, request, format=None) :
        ser = CodaUserSerializer(data = request.data)
        if ser.is_valid() :
            ser.save()
            username = ser.validated_data['username']
            password = ser.validated_data['password']
            return login(username,password,request)
        return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)

class Login(APIView) :
    def post(self, request, format=None) :
        ser = CodaLoginSerializer(data = request.data)
        if ser.is_valid() :
            username = ser.validated_data['username']
            password = ser.validated_data['password']
            return login(username,password,request)
        else :
            return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)

class Logout(APIView) :
    def post(self, request, format=None) :
        logout(request)
        return Response("Logout successful", status=status.HTTP_202_ACCEPTED)
