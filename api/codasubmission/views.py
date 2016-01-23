from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics

class SubmitProblem(generics.GenericAPIView) :
    #check time: must be after start time ... can be after end time
    #check user: must be eligible to compete
