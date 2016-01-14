from __future__ import unicode_literals

from django.db import models
from api.constants import DEFAULT_MAX_LENGTH
from codaauth.models import CodaUser

class Language(models.Model) :
    name = models.CharField(
        max_length=DEFAULT_MAX_LENGTH, 
        primary_key = True
    )
    def __str__(self) :
        return str(self.name)

class CheckerType(models.Model) :
    checkerID = models.CharField(
        max_length=DEFAULT_MAX_LENGTH, 
        primary_key = True
    )
    onlyExecChecker = models.BooleanField()
    needsFile = models.BooleanField()
    
    def __str__(self) :
        return str(self.checkerID)

def getProblemPath(instance, filename) :
    return 'problems/%s/%s' % (instance.problemID,filename)

class Problem(models.Model) :
    problemID = models.CharField(
        max_length=DEFAULT_MAX_LENGTH, 
        unique = True
    )
    languages = models.ManyToManyField(Language)
    checkerType = models.ForeignKey(
        CheckerType,
        on_delete = models.PROTECT,
        default = "diff"
    )
    checker = models.FileField(
        upload_to = getProblemPath,
        null=True
    )
    owner = models.ForeignKey(
        User,
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
    timeLimitMS = models.BigIntegerField(default=0)  #in milliseconds
    memoryLimitBytes = models.BigIntegerField(default=100000000) #in bytes
    
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
        related_name='batches',
        on_delete = models.CASCADE
    )
    constraints = models.TextField(blank=True)
    timeLimitMS = models.IntegerField(default=0)
    memoryLimitBytes = models.BigIntegerField(default=100000000)

    def getNumTestFiles(self) :
        return len(TestFile.objects.filter(batch = self))

    class Meta:
        ordering = ('batchID',)
    
class TestFile(models.Model) :
    testFileID = models.IntegerField()
    batch = models.ForeignKey(
        Batch,
        related_name='testFiles',
        on_delete = models.CASCADE
    )
    #think about upload path of files
    input = models.FileField(blank=True)
    output = models.FileField(blank=True)
    resources = models.FileField(blank=True)
    class Meta:
        ordering = ('testFileID',)

