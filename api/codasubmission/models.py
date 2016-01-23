from __future__ import unicode_literals

from django.db import models

from django.contrib.auth.models import User, Group
from codascorecard.models import *
from codacontest.models import *
from codaproblem.models import *
from api.constants import DEFAULT_MAX_LENGTH, MAIN_CLASS_LENGTH, RESULT_LENGTH


def getBasePath(user, contestProblem, contest) :
    return 'submissions/%s/%s/%s/%s/%s' % (str(contest.id),
                                           str(contestProblem.contestProblemID),
                                           str(username),
                                           str(instance.id))
    
def getSubmissionPath(sub, filename) :
    prob = sub.problem
    base = getBasePath(sub.user, prob, prob.contest)
    return '%s/%s' % (base, filename)

def getUserOutputPath(testFileResult, filename) :
    testFileID = testFileResult.testFile.testFileID
    sub = testFileResult.submission
    prob = sub.problem 
    base = getBasePath(sub.user, prob, prob.contest)
    return '%s/%s/%s' % (base, str(testFileID), filename)

class TestFileResultType(models.Model) :
    name = models.CharField(max_length = RESULT_LENGTH)
    isSuccess = models.BooleanField()
    isPending = models.BooleanField()

class ResultType(models.Model) :
    name = models.CharField(max_length = RESULT_LENGTH)
    isSuccess = models.BooleanField()
    isPending = models.BooleanField()

class ContestSubmission(models.Model) :
    user = models.ForeignKey(
        User,
        on_delete = models.PROTECT,
    )
    submissionTime = models.DateTimeField(auto_now_add = True)
    problem = models.ForeignKey(
        ContestProblem,
        on_delete = models.CASCADE,
        related_name = 'submissions',
    )
    source = models.FileField(
        upload_to = getSubmissionPath
    )
    language = models.ManyToManyField(Language)
    mainClass = models.CharField(max_length = MAIN_CLASS_LENGTH)

class ProblemResult(models.Model) :
    submission = models.ForeignKey(
        ContestSubmission,
        on_delete = models.CASCADE
    )
    problemScorecard = models.ForeignKey(
        ProblemScorecard,
        on_delete = models.CASCADE
    )
    contestProblem = models.ForeignKey(
        ContestProblem,
        on_delete = models.CASCADE
    )
    result = models.ForeignKey(
        ResultType,
        on_delete = models.PROTECT
    )
    score = models.IntegerField(default = 0)

class BatchResult(models.Model) :
    contestBatch = models.ForeignKey(
        ContestBatch,
        on_delete = models.CASCADE
    )
    result = models.ForeignKey(
        ResultType,
        on_delete = models.PROTECT
    )
    batchScorecard = models.ForeignKey(
        BatchScorecard,
        on_delete = models.CASCADE
    )
    problemResult = models.ForeignKey(
        ProblemResult,
        on_delete = models.CASCADE
    )
    lastTestFileDone = models.IntegerField(default = 0)
    score = models.IntegerField(default = 0)
    
class TestFileResult(models.Model) :
    testFile = models.ForeignKey(
        TestFile,
        on_delete = models.PROTECT
    )
    resultTime = models.DateTimeField(auto_now_add = True)
    userOutput = models.FileField(
        upload_to = getUserOutputPath
    )
    result = models.ForeignKey(
        TestFileResultType,
        on_delete = models.PROTECT
    )
    memoryUsedBytes = models.BigIntegerField()
    timeUsedMS = models.BigIntegerField()
    batchResult = models.ForeignKey(
        BatchResult,
        on_delete = models.CASCADE,
        null = True
    )


