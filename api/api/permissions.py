from django.contrib.auth.models import User, Group

MOD_GROUP_NAME = 'Moderators'
moderatorGroup = Group.objects.get(name = MOD_GROUP_NAME)

import sys

def is_super(user) :
    return user.is_superuser

def is_moderator(user) :    
    return is_super(user) or user.groups.filter(id = moderatorGroup.id).exists()

def is_member(user, group) :
    return is_super(user) or user.groups.filter(id = group.id).exists()

def is_owner(user, obj) :
    print >> sys.stderr, str(user)+" "+str(obj.owner)
    return is_super(user) or user == obj.owner
