from __future__ import unicode_literals

import uuid
from datetime import datetime

from rest_framework import serializers
from rest_framework.exceptions import *

from django.contrib.auth.models import User, Group
from codacontest.models import *

class ScoringSystemSerializer(serializers.ModelSerializer) :    
    class Meta:
        model = ScoringSystem

class ContestProblemSerializer(serializers.ModelSerializer):
    class Meta :
        model = ContestProblem

def checkContestTimes(vdata) :
    stime = vdata['startTime']
    etime = vdata['endTime']
    if stime > etime :
        raise serializers.ValidationError('startTime is greater than endTime')
    if etime <= datetime.now() :
        raise serializers.ValidationError('endTime must be in the future')

class SimpleContestSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Contest
        exclude = ('userGroups','graderGroups')

class ContestSerializer(serializers.ModelSerializer) :
    owner = serializers.CharField(source = 'owner.username', read_only=True)
    problems = ContestProblemSerializer(many = True, read_only = True)

    class Meta:
        model = Contest
        fields = ('name', 'languages', 'scoringSystem', 'startTime',
                  'endTime', 'createTime', 'owner', 'isPublicViewable',
                  'isPublicSubmittable', 'problems','userGroups','graderGroups')
        read_only_fields = ('name','owner','userGroups','graderGroups')

    def update(self, instance, vdata):
        checkContestTimes(vdata)
        return super(ContestSerializer,self).update(instance,vdata)

    
class CreateContestSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Contest
        fields = ('name','startTime','endTime')
    
    def save(self, **kwargs):
        vdata = self.validated_data
        checkContestTimes(vdata)
        contest = Contest.objects.create(**kwargs,**vdata)
        uuid = uuid.uuid4()
        ugroup = Group.objects.create(name = 'ContestUserGroup-%s'%uuid)
        ggroup = Group.objects.create(name = 'ContestGraderGroup-%s'%uuid)
        contest.userGroups.add(ugroup)
        contest.graderGroups.add(ggroup)
        ugroup.save()
        ggroup.save()
        contest.save()
