from __future__ import unicode_literals

from rest_framework import serializers
from dbapi.models.auth import CodaUser, CodaGroup

class CodaUserSerializer(serializers.ModelSerializer) :
    class Meta:
        model = CodaUser
        depth = 1
