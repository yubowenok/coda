from __future__ import unicode_literals

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics

import django.contrib.auth as auth
from django.shortcuts import get_object_or_404

from codaauth.models import *
from codaauth.serializers import *
from api.response import ErrorResponse
from api.permissions import *


def login(username, password, request) :
    user = auth.authenticate(username=username, password=password)
    if user is not None :
        if user.is_active :
            auth.login(request,user)
            return Response("Login Successful", status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Account Disabled", status=status.HTTP_403_FORBIDDEN)
    else :
        return ErrorResponse("Bad Credentials", status=status.HTTP_403_FORBIDDEN)
    

class RegisterUser(generics.GenericAPIView) :
    serializer_class = UserSerializer
    queryset = {}
    def post(self, request, format=None) :
        ser = UserSerializer(data = request.data)
        if ser.is_valid() :
            ser.save()
            username = request.data['username']
            password = request.data['password']
            return login(username,password,request)
        return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)

class Login(generics.GenericAPIView) :
    serializer_class = LoginSerializer
    queryset = {}
    def post(self, request, format=None) :
        ser = LoginSerializer(data = request.data)
        if ser.is_valid() :
            username = request.data['username']
            password = request.data['password']
            return login(username,password,request)
        else :
            return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)

class Logout(APIView) :
    def post(self, request, format=None) :
        auth.logout(request)
        return Response("Logout successful", status=status.HTTP_200_OK)

class ChangePassword(generics.GenericAPIView) :
    serializer_class = ChangePasswordSerializer
    queryset = {}
    def post(self, request, format=None) :
        if request.user.is_authenticated() :
            user = request.user
            ser = ChangePasswordSerializer(data = request.data)
            if ser.is_valid() :
                user.set_password(request.data['password'])
                user.save()
                return Response("Change Password Successful", status=status.HTTP_200_OK)
            else :
                return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class GetAllUsers(APIView) :
    def get(self, request, format = None) :
        if request.user.is_authenticated() and is_super(request.user):
            user = request.user
            ser = UserListSerializer(User.objects.all(),many = True)
            return Response(ser.data,status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)
            

class CreateUserGroup(generics.GenericAPIView) :
    serializer_class = CreateGroupSerializer
    queryset = {}
    def post(self, request, format=None) :
        if request.user.is_authenticated() and is_moderator(request.user):
            user = request.user
            ser = CreateGroupSerializer(data = request.data)
            if ser.is_valid() :
                ser.save(owner = user)
                return Response("Create User Group Successful", status=status.HTTP_200_OK)
            else :
                return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        else :
            return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)

class AddUserToGroup(APIView) :
    def post(self, request, username, groupname, format=None) :
        if request.user.is_authenticated() :
            groupuser = get_object_or_404(User,username=username)
            group = get_object_or_404(Group,name=groupname)
            codagroup = get_object_or_404(CodaGroup,group=group)
            if not is_owner(request.user, codagroup) :
                return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)
            if group in groupuser.groups.all() :
                return ErrorResponse("User already in Group", status=status.HTTP_400_BAD_REQUEST)
            groupuser.groups.add(group)
            groupuser.save()
            return Response("User added successfully", status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)
        
class RemoveUserFromGroup(APIView) :
    def post(self, request, username, groupname, format=None) :
        if request.user.is_authenticated() :
            groupuser = get_object_or_404(User,username=username)
            group = get_object_or_404(Group,name=groupname)
            codagroup = get_object_or_404(CodaGroup,group=group)
            if not is_owner(request.user, codagroup) :
                return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)
            if group not in groupuser.groups.all() :
                return ErrorResponse("User not in group", status=status.HTTP_400_BAD_REQUEST)
            groupuser.groups.remove(group)
            groupuser.save()
            return Response("User removed successfully", status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class RemoveGroup(APIView) :
    def post(self, request, groupname, format=None) :
        if request.user.is_authenticated() :
            group = get_object_or_404(Group,name=groupname)
            codagroup = get_object_or_404(CodaGroup,group=group)
            if not is_owner(request.user, codagroup) :
                return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)
            group.delete()
            return Response("Group removed successfully", status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class RenameGroup(generics.GenericAPIView) :
    serializer_class = GroupSerializer
    queryset = {}
    def post(self, request, groupname, format=None) :
        if request.user.is_authenticated() :
            group = get_object_or_404(Group,name=groupname)
            codagroup = get_object_or_404(CodaGroup,group=group)
            if not is_owner(request.user, codagroup) :
                return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)
            ser = GroupSerializer(group, data = request.data, partial = True)
            if ser.is_valid() :
                ser.save()
                return Response("Group renamed successfully", status=status.HTTP_200_OK)
            else :
                return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)                
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)
