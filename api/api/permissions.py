from django.contrib.auth.models import User, Group

MOD_GROUP_NAME = 'Moderators'
MOD_GROUP = None

def getModGroup() :
    global MOD_GROUP
    global MOD_GROUP_NAME
    if MOD_GROUP is None :
        MOD_GROUP = Group.objects.get(name = MOD_GROUP_NAME)
    return MOD_GROUP

def is_super(user) :
    return user.is_superuser

def is_moderator(user) :    
    mg = getModGroup()
    return is_super(user) or user.groups.filter(id = mg.id).exists()

def is_member(user, group) :
    return is_super(user) or user.groups.filter(id = group.id).exists()

def is_owner(user, obj) :
    return is_super(user) or user == obj.owner
