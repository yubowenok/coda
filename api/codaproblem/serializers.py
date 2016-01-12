from __future__ import unicode_literals

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
        batches = problem.batches.all()
        batchID = len(batches)+1
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
        exclude = ('id','batch',)
    
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
    class Meta:
        model = Problem
        fields = ('problemID','checkerType','checker','owner','title','statement','pdfStatement',
                  'usePDF', 'input', 'output', 'timeLimitMS', 'memoryLimitBytes', 'samples', 'batches')
        read_only_fields = ('problemID',)
        extra_kwargs = {'pdfStatement': {'write_only': True}}

