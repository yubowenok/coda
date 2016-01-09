import sys
from codaproblem.serializers import *

checkerTypes = [
    {
	"checkerID" : "diff",
	"onlyExecChecker" : False
    },
    {
	"checkerID" : "User diff",
	"onlyExecChecker" : False
    },
    {
	"checkerID" : "User Checker",
	"onlyExecChecker" : True
    }
]
problems = [
    {
        "problemID" : "Test Problem"
    }
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

for c in checkerTypes :
    ser = CheckerTypeSerializer(data = c)
    if ser.is_valid() :
        ser.save()
    else :
        print >> sys.stderr, ser.errors

for p in problems :
    codauser = CodaUser.objects.all()[0]
    ser = CreateProblemSerializer(data = p)
    if ser.is_valid() :
        prob = ser.save(owner = codauser)
        for sa in samples :
            ser2 = SampleSerializer(data = sa)
            if ser2.is_valid() :
                ser2.save(problem = prob)
            else :
                print >> sys.stderr, ser2.errors                
    else :
        print >> sys.stderr, ser.errors
