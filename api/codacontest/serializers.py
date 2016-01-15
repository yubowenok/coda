from __future__ import unicode_literals

from rest_framework import serializers
from rest_framework.exceptions import *

class ScoringSystemSerializer(serializers.ModelSerializer) :    
    class Meta:
        model = ScoringSystem

class ContestSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Contest
