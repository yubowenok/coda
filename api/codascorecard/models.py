from __future__ import unicode_literals

from django.db import models

from django.contrib.auth.models import User, Group
from codacontest.models import *
from codaproblem.models import *
from api.constants import DEFAULT_MAX_LENGTH, MAIN_CLASS_LENGTH, RESULT_LENGTH

class ContestScorecard(models.Model) :
    user = models.ForeignKey(
        User,
        on_delete = models.PROTECT,
    )
    contest = models.ForeignKey(
        Contest,
        on_delete = models.CASCADE,
        related_name = 'scores'
    )
    score = models.IntegerField(default = 0)
    submissions = models.IntegerField(default = 0)

class ProblemScorecard(models.Model) :
    contestProblem = models.ForeignKey(
        ContestProblem,
        on_delete = models.CASCADE
    )
    contestScorecard = models.ForeignKey(
        ContestScorecard,
        on_delete = models.CASCADE,
        related_name = 'problemScores'
    )
    score = models.IntegerField(default = 0)
    submissions = models.IntegerField(default = 0)

class BatchScorecard(models.Model) :
    contestBatch = models.ForeignKey(
        ContestBatch,
        on_delete = models.CASCADE
    )
    problemScorecard = models.ForeignKey(
        problemScorecard,
        on_delete = models.CASCADE,
        related_name = 'batchScores'
    )
    score = models.IntegerField(default = 0)
    submissions = models.IntegerField(default = 0)
    
