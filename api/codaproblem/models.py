from __future__ import unicode_literals

from django.db import models
from api.constants import DEFAULT_MAX_LENGTH
from codaauth.models import CodaUser

class CheckerType(models.Model) :
    checkerID = models.CharField(
        max_length=DEFAULT_MAX_LENGTH, 
        primary_key = True
    )
    onlyExecChecker = models.BooleanField()
    
    def __str__(self) :
        return str(self.checkerID)

def getProblemPath(instance, filename) :
    return 'problems/%s/%s' % (instance.problemID,filename)

class Problem(models.Model) :
    problemID = models.CharField(
        max_length=DEFAULT_MAX_LENGTH, 
        unique = True
    )
    checkerType = models.ForeignKey(
        CheckerType,
        on_delete = models.CASCADE,
        default = "diff"
    )
    checker = models.FileField(
        upload_to = getProblemPath,
        null=True
    )
    owner = models.ForeignKey(
        CodaUser,
        null = True,
        on_delete = models.SET_NULL
    )
    title = models.TextField(blank=True)
    statement = models.TextField(blank=True)
    pdfStatement = models.FileField(
        upload_to = getProblemPath,
        null=True
    )
    usePDF = models.BooleanField(default=False)
    input = models.TextField(blank=True)
    output = models.TextField(blank=True)
    timeLimit = models.BigIntegerField(default=0)  #in milliseconds
    memoryLimit = models.BigIntegerField(default=100000000) #in bytes
    
class Sample(models.Model) :
    input = models.TextField(blank=True)
    output = models.TextField(blank=True)
    sampleID = models.IntegerField()
    problem = models.ForeignKey(
        Problem,
        related_name='samples',
        on_delete = models.CASCADE
    )
    class Meta:
        ordering = ('sampleID',)

class Batch(models.Model) : 
    batchID = models.IntegerField()
    name = models.CharField(
        max_length=DEFAULT_MAX_LENGTH
    )
    problem = models.ForeignKey(
        Problem, 
        on_delete = models.CASCADE
    )
    memoryLimitBytes = models.BigIntegerField()
    timeLimitMS = models.IntegerField()
    class Meta:
        ordering = ('batchID',)
        unique_together = ('batchID','problem')
    
class TestFile(models.Model) :
    testFileID = models.IntegerField()
    batch = models.ForeignKey(
        Batch,
        on_delete = models.CASCADE
    )
    #think about upload path of files
    input = models.FileField(blank=True)
    output = models.FileField(blank=True)
    resources = models.FileField(blank=True)
    class Meta:
        ordering = ('testFileID',)
        unique_together = ('testFileID','batch')
