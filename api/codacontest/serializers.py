from __future__ import unicode_literals

import uuid

from rest_framework import serializers
from rest_framework.exceptions import *

from django.utils import timezone
from django.contrib.auth.models import User, Group

from codaauth.models import CodaGroup, creategroup
from codacontest.models import *

class ScoringSystemSerializer(serializers.ModelSerializer) :    
    class Meta:
        model = ScoringSystem

class ContestProblemSerializer(serializers.ModelSerializer):
    class Meta :
        model = ContestProblem

def checkContestTimes(startTime, endTime, **kw) :
    if startTime > endTime :
        raise serializers.ValidationError('startTime is greater than endTime')
    if endTime <= timezone.now() :
        raise serializers.ValidationError('endTime must be in the future')

class SimpleContestSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Contest
        exclude = ('userGroups','graderGroups','userGroup','graderGroup')

class ContestSerializer(serializers.ModelSerializer) :
    owner = serializers.CharField(source = 'owner.username', read_only=True)
    problems = ContestProblemSerializer(many = True, read_only = True)
    userGroups = serializers.SlugRelatedField(slug_field = 'name',
                                              many = True, read_only = True)
    graderGroups = serializers.SlugRelatedField(slug_field = 'name',
                                              many = True, read_only = True)
    userGroup = serializers.StringRelatedField(source = 'userGroup.user_set',
                                      many = True, read_only = True)
    graderGroup = serializers.StringRelatedField(source = 'graderGroup.user_set',
                                      many = True, read_only = True)

    class Meta:
        model = Contest
        fields = ('name', 'languages', 'scoringSystem', 'startTime',
                  'endTime', 'createTime', 'owner', 'isPublicViewable',
                  'isPublicSubmittable', 'problems','userGroups',
                  'graderGroups','userGroup','graderGroup')
        read_only_fields = ('name','owner')

    def update(self, instance, vdata):
        d = {'startTime' : vdata.get('startTime',instance.startTime),
             'endTime' : vdata.get('endTime',instance.endTime)}
        checkContestTimes(**d)
        return super(ContestSerializer,self).update(instance,vdata)

    
class CreateContestSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Contest
        fields = ('name','startTime','endTime')
    
    def save(self, **kwargs):
        vdata = self.validated_data
        checkContestTimes(**vdata)
        uid = uuid.uuid4()
        ugroup = creategroup(name = 'ContestUserGroup-%s'%uid)
        ggroup = creategroup(name = 'ContestGraderGroup-%s'%uid)
        d = vdata.copy()
        d.update(kwargs)
        contest = Contest.objects.create(userGroup = ugroup.group,
                                         graderGroup = ggroup.group, 
                                         **d)
        ugroup.save()
        ggroup.save()
        contest.save()
        return contest
