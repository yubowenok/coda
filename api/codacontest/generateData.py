import sys
from datetime import *
from django.contrib.auth.models import User, Group
from codacontest.serializers import *
from codaproblem.models import *
from api.permissions import *
from django.utils import timezone

now = timezone.now()

scoringSystems = [
    {"name" : "ICPC"},
    {"name" : "Batch"},
    {"name" : "BatchLinear"}
]

contests = [
    {
        "name" : "Contest 1",
        "startTime" : now+timedelta(days=1),
        "endTime" : now + timedelta(weeks=10),
    }
]

for ss in scoringSystems : 
    ser = ScoringSystemSerializer(data = ss)
    if ser.is_valid() :
        ser.save()
    else :
        print >> sys.stderr, ser.errors        


for c in contests :
    u = User.objects.all()[0]
    ser = CreateContestSerializer(data = c)
    if ser.is_valid() :
        contest = ser.save(owner = u)
    else :
        print >> sys.stderr, ser.errors        
    
    for u in User.objects.all() :
        contest.userGroup.user_set.add(u)
        contest.graderGroup.user_set.add(u)

    g = Group.objects.get(name = MOD_GROUP_NAME)
    contest.userGroups.add(g)
    contest.graderGroups.add(g)

    for p in Problem.objects.all() :
        ser = CreateContestProblemSerializer(data={})
        if ser.is_valid() :
            ser.save(contest = contest, problem = p)
        else :
            print >> sys.stderr, ser.errors        

