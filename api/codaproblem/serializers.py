from __future__ import unicode_literals

from rest_framework import serializers
from django.contrib.auth.models import User, Group

from codaproblem.models import CheckerType, Problem

class CheckerTypeSerializer(serializers.ModelSerializer) :    
    class Meta:
        model = CheckerType
        fields = ('checkerID','onlyExecChecker')    

class ProblemSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Problem
        fields = ('problemID',)

class SetPDFSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Problem
        fields = ('problemID','pdfStatement')
    
