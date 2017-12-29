import sys
from django.contrib.auth.models import User
from codaauth.models import *
from api.permissions import *

user = User.objects.create_superuser('brett','','brett')
codauser = CodaUser(user = user)
codauser.save()
group = Group.objects.create(name = MOD_GROUP_NAME)
codagroup = CodaGroup(owner = user, group = group)

users = ['Auser','Buser','Cuser']
groups = ['Agroup','Bgroup','Cgroup']

for i in xrange(len(users)) :
    u = users[i]
    user = User.objects.create_user(u,'',u)
    codauser = CodaUser(user = user)
    codauser.save()
    group = Group.objects.create(name = groups[i])
    group.save()
    codagroup = CodaGroup(group = group, owner = user)
    codagroup.save()

for u in users : 
    user = User.objects.get(username = u)
    for g in groups :
        group  = Group.objects.get(name = g)
        user.groups.add(group)

User.objects.get(username = 'Auser').groups.add(Group.objects.get(name = 'Moderators'))
