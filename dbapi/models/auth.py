from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User, Group

from dbapi.models import DEFAULT_MAX_LENGTH

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

class CodaGroup(models.Model) :
    group = models.OneToOneField(
        Group,
        on_delete = models.CASCADE,
        primary_key = True
    )
    owner = models.ForeignKey(
        CodaUser, 
        on_delete = models.SET_NULL, 
        null = True
    )
