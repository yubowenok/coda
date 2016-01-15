from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User, Group

from api.constants import DEFAULT_MAX_LENGTH

class CodaUser(models.Model) :
    user = models.OneToOneField(
        User,
        on_delete = models.CASCADE,
        primary_key = True
    )
    affiliation = models.CharField(
        max_length=DEFAULT_MAX_LENGTH,
        blank = True
    )
    
    def __str__(self) :
        return str(self.user.username)


def createuser(**kwargs) :
    affiliation = kwargs.pop(affiliation,None)
    u = User.objects.create(**kwargs)
    return CodaUser.objects.create(user = u, affiliation = affiliation)
    

class CodaGroup(models.Model) :
    group = models.OneToOneField(
        Group,
        on_delete = models.CASCADE,
        primary_key = True
    )
    owner = models.ForeignKey(
        User, 
        on_delete = models.SET_NULL, 
        null = True
    )

def creategroup(**kwargs) :
    owner = kwargs.pop('owner',None)
    g = Group.objects.create(**kwargs)
    return CodaGroup.objects.create(group = g, owner = owner)
