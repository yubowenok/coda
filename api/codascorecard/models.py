from __future__ import unicode_literals

from django.db import models
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User, Group

from codacontest.models import *
from codaproblem.models import *
from codascorecard.models import ContestSubmission
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
    correctSubmission = models.ForeignKey(
        ContestSubmission,
        on_delete = models.SET_NULL,
        null = True
    ) #used to properly count # of failures before 1st success and success time
    isSuccess = models.BooleanField(default = False)
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
    isSuccess = models.BooleanField(default = False)
    score = models.IntegerField(default = 0)

def getContestSC(user, contest) :
    try :
        cs = contest.scores.get(user = user)
    except ObjectDoesNotExist :
        cs = ContestScorecard.create(user = user, contest = contest)
        cs.save()    
    return cs

def getProblemSC(user, contest, contestProblem) :
    contestScorecard = getContestSC(user,contest)
    try :
        ps = contestScorecard.problemScores.get(contestProblem = contestProblem)
    except ObjectDoesNotExist :
        ps = ProblemScorecard.create(contestScorecard = contestScorecard,
                                     contestProblem = contestProblem)
        ps.save()    
    return ps
    
def getBatchSC(user, contestProblem, contestBatch) :
    contest = contestProblem.contest
    problemScorecard = getProblemSC(user, contest, contestProblem)
    try :
        bs = problemScorecard.batchScores.get(contestBatch = contestBatch)
    except ObjectDoesNotExist :
        bs = BatchScorecard.create(problemScorecard = problemScorecard,
                                   contestBatch = contestBatch)
        bs.save()    
    return bs
    
    
