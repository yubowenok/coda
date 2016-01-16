from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User, Group
from codaproblem.models import Problem, Batch, Language
from api.constants import *

class ScoringSystem(models.Model) :
    name = models.CharField(
        max_length = DEFAULT_MAX_LENGTH,
        primary_key = True
    )
    def __str__(self) :
        return str(self.name)

class Contest(models.Model) :
    name = models.CharField(
        max_length = CONTEST_NAME_LENGTH,
        unique = True
    )
    languages = models.ManyToManyField(Language)
    scoringSystem = models.ForeignKey(
        ScoringSystem,
        on_delete = models.PROTECT,
        default = "ICPC"
    )
    startTime = models.DateTimeField()
    endTime = models.DateTimeField()
    createTime = models.DateTimeField(auto_now_add = True)
    owner = models.ForeignKey(
        User,
        null = True,
        on_delete = models.SET_NULL
    )
    isPublicViewable = models.BooleanField(default = True)
    isPublicSubmittable = models.BooleanField(default = True)
    userGroup = models.ForeignKey(
        Group,
        on_delete = models.PROTECT,
        related_name = 'contestuser'
    )
    userGroups = models.ManyToManyField(
        Group,
        related_name = 'contestusers'
    )
    graderGroup = models.ForeignKey(
        Group,
        on_delete = models.PROTECT,
        related_name = 'contestgrader'
    )
    graderGroups = models.ManyToManyField(
        Group,
        related_name = 'contestgraders'        
    )

class ContestProblem(models.Model) :
    problem = models.ForeignKey(
        Problem,
        on_delete = models.PROTECT
    )
    contest = models.ForeignKey(
        Contest,
        on_delete = models.CASCADE,
        related_name = 'problems'
    )
    contestProblemID = models.IntegerField()
    
    class Meta:
        ordering = ('contestProblemID',)

class ContestBatch(models.Model) :
    contestProblem = models.ForeignKey(
        ContestProblem,
        on_delete = models.CASCADE
    )
    batch = models.ForeignKey(
        Batch,
        on_delete = models.PROTECT,
        related_name = 'batches'
    )
    points = models.IntegerField(default = 0)
    canViewInput = models.BooleanField(default = False)
    canViewOutput = models.BooleanField(default = False)
    
