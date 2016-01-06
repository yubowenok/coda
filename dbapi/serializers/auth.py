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
        aff = vdata.pop('affiliation','')
        pword = vdata.pop('password')
        user = User.objects.create(**vdata)
        user.set_password(pword)
        user.save()
        cuser = CodaUser(
            user=user, 
            affiliation = aff
        )
        cuser.save()

class CodaLoginSerializer(serializers.Serializer) :
    username = serializers.CharField(max_length=30)
    password = serializers.CharField()
