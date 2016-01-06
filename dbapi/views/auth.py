from __future__ import unicode_literals
import sys

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from dbapi.models.auth import CodaUser, CodaGroup
from dbapi.serializers.auth import CodaUserSerializer
from dbapi.views.error import ErrorResponse

from rest_framework.authentication import *

class RegisterUser(APIView) :
    authentication_classes = (SessionAuthentication,)
    def post(self, request, format=None) :
        ser = CodaUserSerializer(data = request.data)
        if ser.is_valid() :
            ser.save()
            return Response(ser.data, status=status.HTTP_201_CREATED)
        return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)
