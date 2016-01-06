from __future__ import unicode_literals

import sys

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

import django.contrib.auth as auth

from dbapi.models.auth import CodaUser, CodaGroup
from dbapi.serializers.auth import CodaUserSerializer, CodaLoginSerializer, CodaChangePasswordSerializer
from dbapi.views.error import ErrorResponse


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
    

class RegisterUser(APIView) :
    def post(self, request, format=None) :
        print >> sys.stderr, "COOKIES: "+ str(request.COOKIES)
        ser = CodaUserSerializer(data = request.data)
        if ser.is_valid() :
            ser.save()
            username = request.data['username']
            password = request.data['password']
            return login(username,password,request)
        return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)

class Login(APIView) :
    def post(self, request, format=None) :
        print >> sys.stderr, "COOKIES: "+ str(request.COOKIES)
        ser = CodaLoginSerializer(data = request.data)
        if ser.is_valid() :
            username = request.data['username']
            password = request.data['password']
            return login(username,password,request)
        else :
            return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)

class Logout(APIView) :
    def post(self, request, format=None) :
        print >> sys.stderr, "COOKIES: "+ str(request.COOKIES)
        auth.logout(request)
        return Response("Logout successful", status=status.HTTP_202_ACCEPTED)

class ChangePassword(APIView) :
    def post(self, request, format=None) :
        print >> sys.stderr, "COOKIES: "+ str(request.COOKIES)
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
