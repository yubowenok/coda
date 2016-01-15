from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics

from django.shortcuts import render

from codacontest.models import *
from codacontest.serializers import *
from api.response import ErrorResponse, FileResponse
from api.permissions import *

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
    
class CreateContest(generics.GenericAPIView) :
    serializer_class = CreateContestSerializer
    queryset = {}
    def post(self, request, format = None) :
        if request.user.is_authenticated() and is_moderator(request.user):
            user = request.user
            ser = CreateContestSerializer(data = request.data)
            if ser.is_valid() :
                ser.save(owner=user)
                return Response("Create Contest Successful", status=status.HTTP_200_OK)
            else :
                return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        else :
            return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)

class SetContest(generics.GenericAPIView) :
    serializer_class = ContestSerializer
    queryset = {}
    def post(self, request, name, format = None) :
        if request.user.is_authenticated() :
            contest = get_object_or_404(Contest, name = name)
            if not is_owner(request.user, contest) :
                return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)                
            ser = ContestSerializer(contest, data = request.data, partial = True)
            if ser.is_valid() :
                ser.save()
                return Response("Set Contest Accepted", status=status.HTTP_200_OK)
            else :
                return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class GetContest(APIView) :
    def get(self, request, name, format = None) :
        if request.user.is_authenticated() :
            contest = get_object_or_404(Contest,name = name)
            if not is_owner(request.user, contest) :
                return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)                
            ser = ContestSerializer(obj)
            return Response(ser.data, status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)
