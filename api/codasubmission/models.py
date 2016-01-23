from __future__ import unicode_literals

from django.db import models
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User, Group

from codascorecard.models import *
from codacontest.models import *
from codaproblem.models import *
from api.constants import DEFAULT_MAX_LENGTH, MAIN_CLASS_LENGTH, RESULT_LENGTH


def getBasePath(user, contestProblem, contest, sub) :
    return 'submissions/%s/%s/%s/%s/%s' % (str(contest.id),
                                           str(contestProblem.contestProblemID),
                                           str(username),
                                           str(sub.id))
    
def getSubmissionPath(sub, filename) :
    prob = sub.problem
    base = getBasePath(sub.user, prob, prob.contest, sub)
    return '%s/sub/%s' % (base, filename)

def getUserOutputPath(testFileResult, filename) :
    testFileID = testFileResult.testFile.testFileID
    sub = testFileResult.submission
    prob = sub.problem 
    base = getBasePath(sub.user, prob, prob.contest, sub)
    return '%s/%s/out/%s' % (base, str(testFileID), filename)

def getEnvPath(testFileResult, filename) :
    testFileID = testFileResult.testFile.testFileID
    sub = testFileResult.submission
    prob = sub.problem 
    base = getBasePath(sub.user, prob, prob.contest, sub)
    return '%s/%s/env/%s' % (base, str(testFileID), filename)

class ResultType(models.Model) :
    name = models.CharField(max_length = RESULT_LENGTH)
    isSuccess = models.BooleanField()
    isPending = models.BooleanField()
    isError = models.BooleanField()

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
        on_delete = models.PROTECT,
        default = "PENDING"
    )
    score = models.IntegerField(default = 0)

class BatchResult(models.Model) :
    contestBatch = models.ForeignKey(
        ContestBatch,
        on_delete = models.CASCADE
    )
    result = models.ForeignKey(
        ResultType,
        on_delete = models.PROTECT,
        default = "PENDING"
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
        upload_to = getUserOutputPath,
        blank = True
    )
    userEnv = = models.FileField(
        upload_to = getUserEnvPath,
        blank = True
    )
    result = models.ForeignKey(
        ResultType,
        on_delete = models.PROTECT,
        default = "PENDING"
    )
    memoryUsedBytes = models.BigIntegerField(default = 0)
    timeUsedMS = models.BigIntegerField(default = 0)
    batchResult = models.ForeignKey(
        BatchResult,
        on_delete = models.CASCADE,
        null = True
    )

class TestFileJob(models.Model) :
    testFileResult = models.ForeignKey(
        TestFileResult,
        on_delete = models.CASCADE
    )
    submission = models.ForeignKey(
        ContestSubmission,
        on_delete = models.CASCADE
    )
    submissionTime = models.DateTimeField(
        db_index = True
    ) #duplicated for speed
    result = models.ForeignKey(
        ResultType,
        on_delete = models.PROTECT,
        default = "PENDING"
    ) #can remove result and just have jobs deleted from queue
    storeEnvironment = models.BooleanField(default = False) #for one-off jobs
    class Meta:
        ordering = ('submissionTime',)

#Gets (or creates if necessary) problem result, creates batch result, and all
#dependent test file results.
def createBatchResults(batchScorecard, contestProblem, contestBatch, submission) :
    psc = batchScorecard.problemScorecard
    try :
        pr = ProblemResult.objects.get(submission = submission)
    except ObjectNotFound :
        pr = ProblemResult.objects.create(submission = submission,
                                          problemScorecard = psc,
                                          contestProblem = contestProblem)
        pr.save()
    br = BatchResult.objects.create(contestBatch = contestBatch,
                                    batchScorecard = batchScorecard,
                                    problemResult = pr)
    br.save()
    for tf in contestBatch.batch.testFiles.all() :
        tfr = TestFileResult.objects.create(testFile = tf,
                                            batchResult = br)
        tfr.save()
    return br
