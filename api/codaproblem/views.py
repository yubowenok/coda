from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics

from codaproblem.models import CheckerType
from codaproblem.serializers import CheckerTypeSerializer, ProblemSerializer, SetPDFSerializer
from api.error import ErrorResponse

class CheckerTypes(generics.GenericAPIView) :
    serializer_class = CheckerTypeSerializer
    def get(self, request, format = None) :
        if request.user.is_authenticated() :
            ser = CheckerTypeSerializer(CheckerType.objects.all(), many=True)
            return Response(ser.data, status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class CreateProblem(generics.GenericAPIView) :
    serializer_class = ProblemSerializer
    def post(self, request, format = None) :
        if request.user.is_authenticated() :
            user = request.user
            ser = ProblemSerializer(data = request.data)
            if ser.is_valid() :
                ser.save(owner=user.codauser)
                return Response("Create Problem Successful", status=status.HTTP_202_ACCEPTED)
            else :
                return ErrorResponse(ser.errors, status=status.HTTP_403_FORBIDDEN)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class SetPDF(generics.GenericAPIView) :
    serializer_class = SetPDFSerializer
    def post(self, request, format = None) :
        if request.user.is_authenticated() :
            ser = SetPDFSerializer(data = request.data)
            if ser.is_valid() :
                ser.save()
                return Response("Set PDF Succesful", status=status.HTTP_202_ACCEPTED)
            else :
                return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)
