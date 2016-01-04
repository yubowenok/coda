from __future__ import unicode_literals

from django.db import models
from dbapi.models import DEFAULT_MAX_LENGTH
from dbapi.models.auth import CodaUser

class CheckerType(models.Model) :
    checkerID = models.CharField(
        max_length=DEFAULT_MAX_LENGTH, 
        unique = True
    )
    onlyExecChecker = models.BooleanField()

class Problem(models.Model) :
    problemID = models.CharField(
        max_length=DEFAULT_MAX_LENGTH, 
        unique = True
    )
    checkerType = models.ForeignKey(
        CheckerType,
        on_delete = models.CASCADE
    )
    checker = models.FileField(blank=True)
    owner = CodaUser()
    title = models.TextField()
    statement = models.TextField()
    pdfStatement = models.FileField(blank=True)
    usePDF = models.BooleanField()
    input = models.TextField()
    output = models.TextField()

    
class Sample(models.Model) :
    input = models.TextField()
    output = models.TextField()
    sampleID = models.IntegerField()
    problem = models.ForeignKey(
        Problem,
        on_delete = models.CASCADE
    )
    class Meta:
        unique_together = ('id', 'problem')

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
        unique_together = ('id', 'problem')
    
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
        unique_together = ('id', 'batch')

