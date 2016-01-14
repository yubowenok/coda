from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User, Group
from codaproblem.models import Problem, Batch

class ScoringSystem(models.Model) :
    name = models.CharField(
        max_length = DEFAULT_MAX_LENGTH,
        primary_key = True
    )
    def __str__(self) :
        return str(self.name)

class Contest(models.Model) :
    name = models.CharField(
        max_length = 200,
        unique = True
    )
    languages = models.ManyToManyField(Langauge)
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
    userGroups = models.ManyToManyField(Group)
    graderGroups = models.ManyToManyField(Group)

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
    problemID = models.IntegerField()
    
    class Meta:
        ordering = ('problemID',)

class ContestBatch(models.Model) :
    contestProblem = models.ForeignKey(
        ContestProblem,
        on_delete = models.CASCADE
    )
    batch = models.ForeignKey(
        Batch,
        on_delete = models.PROTECT
    )
    points = models.IntegerField(default = 0)
    canViewInput = models.BooleanField(default = false)
    canViewOutput = models.BooleanField(default = false)
    
