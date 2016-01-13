from __future__ import unicode_literals

from rest_framework import serializers
from django.contrib.auth.models import User, Group

from codaauth.models import CodaUser, CodaGroup
from api.constants import DEFAULT_MAX_LENGTH

class UserSerializer(serializers.ModelSerializer) :
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

class LoginSerializer(serializers.Serializer) :
    username = serializers.CharField(max_length=30)
    password = serializers.CharField(style={'input_type': 'password'})

class ChangePasswordSerializer(serializers.Serializer) :
    password = serializers.CharField(style={'input_type': 'password'})

class UserListSerializer(serializers.Serializer) :
    username = serializers.CharField()    
    is_superuser = serializers.BooleanField()
    groups = serializers.SlugRelatedField(
        many = True,
        read_only = True,
        slug_field = 'name',
    )
    affiliation = serializers.CharField(source='codauser.affiliation')
    

class CreateGroupSerializer(serializers.ModelSerializer) :
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

class GroupSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Group
        fields = ('name',)
    
    
