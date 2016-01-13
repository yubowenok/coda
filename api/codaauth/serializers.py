from __future__ import unicode_literals

from rest_framework import serializers
from django.contrib.auth.models import User, Group

from codaauth.models import CodaUser, CodaGroup
from api.constants import DEFAULT_MAX_LENGTH

class CodaUserSerializer(serializers.ModelSerializer) :
    affiliation = serializers.CharField(
        max_length = DEFAULT_MAX_LENGTH,
        required = False
    )

    class Meta:
        model = User
        fields = ('username','email','password','affiliation')
        extra_kwargs = {'password': {'write_only': True, 'style' : {'input_type': 'password'}}}

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
    password = serializers.CharField(style={'input_type': 'password'})

class CodaChangePasswordSerializer(serializers.Serializer) :
    password = serializers.CharField(style={'input_type': 'password'})

class CreateCodaGroupSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Group
        fields = ('name',)

    def save(self, **kw):
        vdata = self.validated_data
        owner = kw['owner']
        group = Group.objects.create(**vdata)
        group.save()
        cgroup = CodaGroup(owner=owner,group=group)
        cgroup.save()

        
    
