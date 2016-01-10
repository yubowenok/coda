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

class SampleSerializer(serializers.ModelSerializer) :
    def create(self, validated_data) :
        problem = validated_data['problem']
        samples = problem.samples.all()
        sampleID = len(samples)+1
        if sampleID != validated_data['sampleID'] :
            raise ValidationError('Invalid sampleID')
        return Sample.objects.create(**validated_data)

    class Meta:
        model = Sample
        exclude = ('problem',)

class SampleReorderSerializer(serializers.Serializer) :
    newSampleIDs = serializers.ListField(child = serializers.IntegerField())

class SetSampleSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Sample
        exclude = ('sampleID', 'problem')    

class BatchSerializer(serializers.ModelSerializer) :
    def create(self, validated_data) :
        problem = validated_data['problem']
        batches = problem.batches.all()
        batchID = len(batches)+1
        if batchID != validated_data['batchID'] :
            raise ValidationError('Invalid batchID')
        return Batch.objects.create(**validated_data)

    class Meta:
        model = Batch
        exclude = ('problem',)
    
class BatchReorderSerializer(serializers.Serializer) :
    newBatchIDs = serializers.ListField(child = serializers.IntegerField())

class SetBatchSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Batch
        exclude = ('batchID', 'problem')    

class CreateProblemSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Problem
        fields = ('problemID',)

class ProblemSerializer(serializers.ModelSerializer) :
    owner = serializers.CharField(source = 'owner.user.username', read_only=True)
    samples = SampleSerializer(many = True, read_only = True)
    batches = BatchSerializer(many = True, read_only = True)
    class Meta:
        model = Problem
        fields = ('problemID','checkerType','checker','owner','title','statement','pdfStatement',
                  'usePDF', 'input', 'output', 'timeLimitMS', 'memoryLimitBytes', 'samples', 'batches')
        read_only_fields = ('problemID',)
        extra_kwargs = {'pdfStatement': {'write_only': True}}

