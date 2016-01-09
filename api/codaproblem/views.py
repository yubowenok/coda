import sys

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics

from django.shortcuts import get_object_or_404

from codaproblem.models import *
from codaproblem.serializers import *
from api.error import ErrorResponse

class CheckerTypes(generics.GenericAPIView) :
    serializer_class = CheckerTypeSerializer
    queryset = {}
    def get(self, request, format = None) :
        if request.user.is_authenticated() :
            ser = CheckerTypeSerializer(CheckerType.objects.all(), many=True)
            return Response(ser.data, status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class CreateProblem(generics.GenericAPIView) :
    serializer_class = CreateProblemSerializer
    queryset = {}
    def post(self, request, format = None) :
        if request.user.is_authenticated() :
            user = request.user
            ser = CreateProblemSerializer(data = request.data)
            if ser.is_valid() :
                ser.save(owner=user.codauser)
                return Response("Create Problem Successful", status=status.HTTP_202_ACCEPTED)
            else :
                return ErrorResponse(ser.errors, status=status.HTTP_403_FORBIDDEN)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class GetProblemIDs(APIView) :
    def get(self, request, format = None) :
        if request.user.is_authenticated() :
            IDs = [problem.problemID for problem in Problem.objects.all()]
            return Response(IDs, status=status.HTTP_202_ACCEPTED)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class GetProblem(APIView) :
    def get(self, request, problemID, format = None) :
        if request.user.is_authenticated() :
            obj = get_object_or_404(Problem,problemID = problemID)
            ser = ProblemSerializer(obj)
            return Response(ser.data, status=status.HTTP_202_ACCEPTED)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)
    
class SetProblem(generics.GenericAPIView) :
    serializer_class = ProblemSerializer
    queryset = {}
    def post(self, request, problemID, format = None) :
        if request.user.is_authenticated() :
            obj = get_object_or_404(Problem,problemID = problemID)
            ser = ProblemSerializer(obj, data = request.data, partial = True)
            if ser.is_valid() :
                ser.save()
                return Response("Set Problem Accepted", status=status.HTTP_202_ACCEPTED)
            else :
                return ErrorResponse(ser.errors, status=status.HTTP_403_FORBIDDEN)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class AddSample(generics.GenericAPIView) :
    serializer_class = SampleSerializer
    queryset = {}
    def post(self, request, problemID, format = None) :
        if request.user.is_authenticated() :
            problem = get_object_or_404(Problem,problemID = problemID)
            ser = SampleSerializer(data = request.data)
            if ser.is_valid() :
                sam = ser.save(problem = problem)                
                return Response("Added Sample "+str(sam.sampleID), status=status.HTTP_202_ACCEPTED)
            else :
                return ErrorResponse(ser.errors, status=status.HTTP_403_FORBIDDEN)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)
            
class ReorderSamples(generics.GenericAPIView) :
    serializer_class = SampleReorderSerializer
    queryset = {}
    def post(self, request, problemID, format = None) :
        if request.user.is_authenticated() :
            problem = get_object_or_404(Problem,problemID = problemID)
            ser = SampleReorderSerializer(data = request.data)
            if ser.is_valid() :
                newIDs = ser.validated_data['newSampleIDs']
                samples = Sample.objects.filter(problem = problem)
                if len(samples) != len(newIDs) :
                    return ErrorResponse({'newSampleIDs':'Incorrect number of IDs'}, status=status.HTTP_403_FORBIDDEN)
                for i in xrange(len(samples)) :
                    samples[i].sampleID = newIDs[i]
                    samples[i].save()
                return Response("Samples Reordered Successfully", status=status.HTTP_202_ACCEPTED)
            else :
                return ErrorResponse(ser.errors, status=status.HTTP_403_FORBIDDEN)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class DeleteSample(APIView) :
    def post(self, request, problemID, sampleID, format = None) :
        if request.user.is_authenticated() :
            problem = get_object_or_404(Problem,problemID = problemID)
            sample = get_object_or_404(Sample,problem=problem,sampleID = sampleID)
            sample.delete()
            gtSamples = Sample.objects.filter(problem=problem,sampleID__gt = sampleID)
            num = 0
            for s in gtSamples :
                s.sampleID = s.sampleID - 1
                s.save()
                num += 1
            return Response("Deleted sample %s and renumbered %d samples"%(sampleID,num), status=status.HTTP_202_ACCEPTED)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)
