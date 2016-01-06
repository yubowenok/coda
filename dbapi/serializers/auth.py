from __future__ import unicode_literals

from rest_framework import serializers
from django.contrib.auth.models import User, Group

from dbapi.models.auth import CodaUser, CodaGroup
from dbapi.models import DEFAULT_MAX_LENGTH

class CodaUserSerializer(serializers.ModelSerializer) :
    affiliation = serializers.CharField(
        max_length = DEFAULT_MAX_LENGTH,
        required = False
    )

    class Meta:
        model = User
        fields = ('username','email','password','affiliation')
        extra_kwargs = {'password': {'write_only': True}}

    def save(self):
        vdata = self.validated_data
        user = User(
            email=vdata['email'],
            username=vdata['username']
        )
        user.set_password(vdata['password'])
        user.save()
        cuser = CodaUser(
            user=user, 
            affiliation = vdata['affiliation']
        )
        cuser.save()
