from __future__ import unicode_literals

import uuid

from rest_framework import serializers
from rest_framework.exceptions import *

from django.utils import timezone
from django.contrib.auth.models import User, Group

from codaauth.models import CodaGroup, creategroupandsave
from codaproblem.serializers import BatchSerializer
from codacontest.models import *

class ScoringSystemSerializer(serializers.ModelSerializer) :    
    class Meta:
        model = ScoringSystem

class ContestBatchSerializer(serializers.ModelSerializer) :
    batch = BatchSerializer(read_only = True)
    class Meta :
        model = ContestBatch
        fields = ('batch', 'points', 'canViewInput', 'canViewOutput')

class ContestProblemSerializer(serializers.ModelSerializer) :
    batches = ContestBatchSerializer(many = True, read_only = True)
    class Meta :
        model = ContestProblem
        fields = ('problem','contestProblemID','batches')
        read_only_fields = ('problem','contestProblemID')

class CreateContestProblemSerializer(serializers.Serializer):
    def save(self, **kw) :
        problem = kw['problem']
        contest = kw['contest']
        id = contest.problems.count()+1
        cproblem = ContestProblem.objects.create(contest=contest,problem=problem,
                                                     contestProblemID = id)
        cproblem.save()
        for b in problem.batches.all() :
            cbatch = ContestBatch.objects.create(contestProblem = cproblem, batch = b)
            cbatch.save()
        return cproblem

class ContestProblemReorderSerializer(serializers.Serializer) :
    newContestProblemIDs = serializers.ListField(child = serializers.IntegerField())

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
        ugroup = creategroupandsave(name = 'ContestUserGroup-%s'%uid)
        ggroup = creategroupandsave(name = 'ContestGraderGroup-%s'%uid)
        d = vdata.copy()
        d.update(kwargs)
        contest = Contest.objects.create(userGroup = ugroup.group,
                                         graderGroup = ggroup.group, 
                                         **d)
        contest.save()
        return contest
