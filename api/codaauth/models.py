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


def createuserandsave(**kwargs) :
    affiliation = kwargs.pop(affiliation,None)
    u = User.objects.create(**kwargs)
    u.save()
    cu = CodaUser.objects.create(user = u, affiliation = affiliation)
    cu.save()
    return cu
    
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

def creategroupandsave(**kwargs) :
    owner = kwargs.pop('owner',None)
    g = Group.objects.create(**kwargs)
    g.save()
    cg = CodaGroup.objects.create(group = g, owner = owner)
    cg.save()
    return cg
