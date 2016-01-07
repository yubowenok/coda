from __future__ import unicode_literals

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics

import django.contrib.auth as auth

from codaauth.models import CodaUser, CodaGroup
from codaauth.serializers import CodaUserSerializer, CodaLoginSerializer, CodaChangePasswordSerializer
from api.error import ErrorResponse


def login(username, password, request) :
    user = auth.authenticate(username=username, password=password)
    if user is not None :
        if user.is_active :
            auth.login(request,user)
            return Response("Login Successful", status=status.HTTP_202_ACCEPTED)
        else :
            return ErrorResponse("Account Disabled", status=status.HTTP_403_FORBIDDEN)
    else :
        return ErrorResponse("Bad Credentials", status=status.HTTP_403_FORBIDDEN)
    

class RegisterUser(generics.GenericAPIView) :
    serializer_class = CodaUserSerializer
    def post(self, request, format=None) :
        ser = CodaUserSerializer(data = request.data)
        if ser.is_valid() :
            ser.save()
            username = request.data['username']
            password = request.data['password']
            return login(username,password,request)
        return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)

class Login(generics.GenericAPIView) :
    serializer_class = CodaLoginSerializer
    def post(self, request, format=None) :
        ser = CodaLoginSerializer(data = request.data)
        if ser.is_valid() :
            username = request.data['username']
            password = request.data['password']
            return login(username,password,request)
        else :
            return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)

class Logout(APIView) :
    def post(self, request, format=None) :
        auth.logout(request)
        return Response("Logout successful", status=status.HTTP_202_ACCEPTED)

class ChangePassword(generics.GenericAPIView) :
    serializer_class = CodaChangePasswordSerializer
    def post(self, request, format=None) :
        if request.user.is_authenticated() :
            user = request.user
            ser = CodaChangePasswordSerializer(data = request.data)
            if ser.is_valid() :
                user.set_password(request.data['password'])
                user.save()
                return Response("Change Password Successful", status=status.HTTP_202_ACCEPTED)
            else :
                return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)
