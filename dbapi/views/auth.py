from __future__ import unicode_literals
import sys

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from dbapi.models.auth import CodaUser, CodaGroup
from dbapi.serializers.auth import CodaUserSerializer, CodaLoginSerializer
from dbapi.views.error import ErrorResponse

from rest_framework.authentication import *

def login(ser, request) :
    vdata = ser.validated_data
    username = ser['username']
    password = ser['password']
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
            return login(ser,request)
        return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)

class Login(APIView) :
    def post(self, request, format=None) :
        ser = CodaLoginSerializer(data = request.data)
        if ser.is_valid() :
            return login(ser,request)
        else :
            return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)
