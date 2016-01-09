from __future__ import unicode_literals

import sys

from rest_framework import serializers
from rest_framework.exceptions import *
from django.contrib.auth.models import User, Group

from api.constants import DEFAULT_MAX_LENGTH
from codaproblem.models import *

class CheckerTypeSerializer(serializers.ModelSerializer) :    
    class Meta:
        model = CheckerType
        fields = ('checkerID','onlyExecChecker')    

class CreateProblemSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Problem
        fields = ('problemID',)

class SampleListSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Sample
        fields = ('input','output','sampleID')
        read_only_fields = ('sampleID','problemID')

class ProblemSerializer(serializers.ModelSerializer) :
    owner = serializers.CharField(source = 'owner.user.username', read_only=True)
    samples = SampleListSerializer(many = True, read_only = True)
    class Meta:
        model = Problem
        fields = ('problemID','checkerType','checker','owner','title','statement','pdfStatement',
        'usePDF', 'input', 'output', 'timeLimit', 'memoryLimit', 'samples')
        read_only_fields = ('problemID',)
        extra_kwargs = {'pdfStatement': {'write_only': True}}

class SampleSerializer(serializers.ModelSerializer) :
    def create(self, validated_data) :
        problem = validated_data['problem']
        samples = problem.samples.all()
        sampleID = len(samples)+1
        if sampleID != validated_data['sampleID'] :
            print >> sys.stderr, "VALIDATION ERROR"
            raise ValidationError('Invalid sampleID')
        return Sample.objects.create(**validated_data)

    class Meta:
        model = Sample
        fields = ('sampleID', 'input','output')

class SampleReorderSerializer(serializers.Serializer) :
    newSampleIDs = serializers.ListField(child = serializers.IntegerField())
