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

class SampleSerializer(serializers.ModelSerializer) :
    def create(self, validated_data) :
        problem = validated_data['problem']
        sampleID = problem.samples.all().count()+1
        return Sample.objects.create(sampleID = sampleID,**validated_data)

    class Meta:
        model = Sample
        exclude = ('id','problem','sampleID')

class SampleReorderSerializer(serializers.Serializer) :
    newSampleIDs = serializers.ListField(child = serializers.IntegerField())

class BatchSerializer(serializers.ModelSerializer) :
    numTestFiles = serializers.CharField(source='getNumTestFiles',read_only=True)

    def create(self, validated_data) :
        problem = validated_data['problem']
        batchID = problem.batches.all().count()+1
        return Batch.objects.create(batchID = batchID,**validated_data)

    class Meta:
        model = Batch
        exclude = ('id','problem','batchID')
    
class BatchReorderSerializer(serializers.Serializer) :
    newBatchIDs = serializers.ListField(child = serializers.IntegerField())

class TestFileSerializer(serializers.ModelSerializer) :
    def create(self, validated_data) :
        batch = validated_data['batch']
        testFiles = batch.testFiles.all()
        testFileID = len(testFiles)+1
        return TestFile.objects.create(testFileID = testFileID, **validated_data)

    class Meta:
        model = TestFile
        exclude = ('id','batch','testFileID')
        extra_kwargs = {
            'input' : {'allow_empty_file' : True},
            'output' : {'allow_empty_file' : True},
            'resources' : {'allow_empty_file' : True},
        }
    
class TestFileReorderSerializer(serializers.Serializer) :
    newTestFileIDs = serializers.ListField(child = serializers.IntegerField())

class CreateProblemSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Problem
        fields = ('problemID',)

class ProblemSerializer(serializers.ModelSerializer) :
    owner = serializers.CharField(source = 'owner.user.username', read_only=True)
    samples = SampleSerializer(many = True, read_only = True)
    batches = BatchSerializer(many = True, read_only = True)

    def update(self, instance, validated_data):
        ct = validated_data.get('checkerType',instance.checkerType)
        c = validated_data.get('checker',instance.checker)
        if ct.needsFile and not c :
            raise serializers.ValidationError('checkerType '+str(ct)+' requires a checker file')

        usepdf = validated_data.get('usePDF',instance.usePDF)
        pdf = validated_data.get('pdfStatement',instance.pdfStatement)
        if usepdf and not pdf :
            raise serializers.ValidationError('usePDF=True requires a pdfStatement')

        return super(ProblemSerializer,self).update(instance,validated_data)

    class Meta:
        model = Problem
        fields = ('problemID','checkerType','checker','owner','title','statement','pdfStatement',
                  'usePDF', 'input', 'output', 'timeLimitMS', 'memoryLimitBytes', 'samples', 'batches')
        read_only_fields = ('problemID',)
        extra_kwargs = {
            'pdfStatement': {'write_only': True},
            'checker' : {'write_only': True},
        }

