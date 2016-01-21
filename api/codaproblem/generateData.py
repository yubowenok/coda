import sys
from django.core.files import File
from django.contrib.auth.models import User, Group
from codaproblem.serializers import *

languages = [
    {"name" : "Java"},
    {"name" : "C++"},
    {"name" : "Python"}
]

checkerTypes = [
    {
	"checkerID" : "diff",
	"onlyExecChecker" : False,
        "needsFile" : False
    },
    {
	"checkerID" : "User diff",
	"onlyExecChecker" : False,
        "needsFile" : True
    },
    {
	"checkerID" : "User Checker",
	"onlyExecChecker" : True,
        "needsFile" : True
    }
]
problems = [
    {
        "problemID" : "Test Problem"
    },
    {
        "problemID" : "Test Problem 2"
    },
]
samples = [
    {
        "sampleID" : 1,
        "input" : "Input 1",
        "output" : "Output 1"
    },
    {
        "sampleID" : 2,
        "input" : "Input 2",
        "output" : "Output 2"
    },
    {
        "sampleID" : 3,
        "input" : "Input 3",
        "output" : "Output 3"
    },
]
batches = [
    {
        "batchID" : 1,
        "name" : "Batch 1",
    },
    {
        "batchID" : 2,
        "name" : "Batch 2",
    },
    {
        "batchID" : 3,
        "name" : "Batch 3",
    },    
]
testFiles = [
    {
        "input" : File(open("generateData.py",mode='r')),
        "output" : File(open("generateData.py",mode='r')),
        "resources" : File(open("generateData.py",mode='r')),
    },
]


for lan in languages :
    ser = LanguageSerializer(data = lan)
    if ser.is_valid() :
        ser.save()
    else :
        print >> sys.stderr, ser.errors        

for c in checkerTypes :
    ser = CheckerTypeSerializer(data = c)
    if ser.is_valid() :
        ser.save()
    else :
        print >> sys.stderr, ser.errors

for p in problems :
    user = User.objects.all()[0]
    ser = CreateProblemSerializer(data = p)
    if ser.is_valid() :
        prob = ser.save(owner = user)
        for sa in samples :
            ser2 = SampleSerializer(data = sa)
            if ser2.is_valid() :
                ser2.save(problem = prob)
            else :
                print >> sys.stderr, ser2.errors                
        for ba in batches :
            ser2 = BatchSerializer(data = ba)
            if ser2.is_valid() :
                b = ser2.save(problem = prob)
                for tf in testFiles :
                    ser3 = TestFileSerializer(data = tf)
                    if ser3.is_valid() :                        
                        ser3.save(batch = b)
                    else :
                        print >> sys.stderr, ser3.errors                
            else :
                print >> sys.stderr, ser2.errors                            
    else :
        print >> sys.stderr, ser.errors
