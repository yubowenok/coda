from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics

from django.shortcuts import render

class ScoringSystems(APIView) :
    def get(self, request, format = None) :
        if request.user.is_authenticated() :
            ser = ScoringSystemSerializer(ScoringSystem.objects.all(), many=True)
            return Response(ser.data, status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class GetContests(APIView) :
    def get(self, request, format = None) :
        if request.user.is_authenticated() :
            ser = ContestSerializer(ContestSerializer.objects.all(), many=True)
            return Response(ser.data, status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)
    
