from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics

from django.shortcuts import get_object_or_404

from codaproblem.models import Problem, Batch
from codacontest.models import *
from codacontest.serializers import *
from api.response import ErrorResponse, FileResponse
from api.permissions import *

class ScoringSystems(APIView) :
    def get(self, request, format = None) :
        if request.user.is_authenticated() :
            ser = ScoringSystemSerializer(ScoringSystem.objects.all(), many=True)
            return Response(ser.data, status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class GetContests(APIView) : #need to filter by viewable
    def get(self, request, format = None) :
        if request.user.is_authenticated() :
            ser = ContestSerializer(Contest.objects.all(), many=True)
            return Response(ser.data, status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)
    
class CreateContest(generics.GenericAPIView) :
    serializer_class = CreateContestSerializer
    queryset = {}
    def post(self, request, format = None) :
        if request.user.is_authenticated() and is_moderator(request.user):
            user = request.user
            ser = CreateContestSerializer(data = request.data)
            if ser.is_valid() :
                ser.save(owner=user)
                return Response("Create Contest Successful", status=status.HTTP_200_OK)
            else :
                return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        else :
            return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)

class SetContest(generics.GenericAPIView) :
    serializer_class = ContestSerializer
    queryset = {}
    def post(self, request, name, format = None) :
        if request.user.is_authenticated() :
            contest = get_object_or_404(Contest, name = name)
            if not is_owner(request.user, contest) :
                return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)                
            ser = ContestSerializer(contest, data = request.data, partial = True)
            if ser.is_valid() :
                ser.save()
                return Response("Set Contest Accepted", status=status.HTTP_200_OK)
            else :
                return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class GetContest(APIView) :
    def get(self, request, name, format = None) :
        if request.user.is_authenticated() :
            contest = get_object_or_404(Contest,name = name)
            if not is_owner(request.user, contest) :
                return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)                
            ser = ContestSerializer(obj)
            return Response(ser.data, status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class AddUserContest(APIView) :
    def post(self, request, name, username, format = None) :
        if request.user.is_authenticated() :
            contest = get_object_or_404(Contest, name = name)
            if not is_owner(request.user, contest) :
                return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)                
            user = get_object_or_404(User, username = username)
            contest.userGroup.add(user)
            contest.save()
            return Response("User added", status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class AddGraderContest(APIView) :
    def post(self, request, name, username, format = None) :
        if request.user.is_authenticated() :
            contest = get_object_or_404(Contest, name = name)
            if not is_owner(request.user, contest) :
                return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)                
            user = get_object_or_404(User, username = username)
            contest.graderGroup.add(user)
            contest.save()
            return Response("Grader added", status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class AddUserGroupContest(APIView) :
    def post(self, request, name, groupname, format = None) :
        if request.user.is_authenticated() :
            contest = get_object_or_404(Contest, name = name)
            if not is_owner(request.user, contest) :
                return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)                
            group = get_object_or_404(Group, name = groupname)
            contest.userGroups.add(group)
            contest.save()
            return Response("User group added", status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class AddGraderGroupContest(APIView) :
    def post(self, request, name, groupname, format = None) :
        if request.user.is_authenticated() :
            contest = get_object_or_404(Contest, name = name)
            if not is_owner(request.user, contest) :
                return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)                
            group = get_object_or_404(Group, name = groupname)
            contest.graderGroups.add(group)
            contest.save()
            return Response("Grader group added", status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class DeleteUserContest(APIView) :
    def post(self, request, name, username, format = None) :
        if request.user.is_authenticated() :
            contest = get_object_or_404(Contest, name = name)
            if not is_owner(request.user, contest) :
                return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)          
            user = get_object_or_404(User, username = username)
            if not contest.userGroup.filter(id = user.id).exists() :
                return ErrorResponse("User not in group", status=status.HTTP_400_BAD_REQUEST)
            contest.userGroup.remove(user)
            return Response("User removed", status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class DeleteGraderContest(APIView) :
    def post(self, request, name, username, format = None) :
        if request.user.is_authenticated() :
            contest = get_object_or_404(Contest, name = name)
            if not is_owner(request.user, contest) :
                return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)          
            user = get_object_or_404(User, username = username)
            if not contest.graderGroup.filter(id = user.id).exists() :
                return ErrorResponse("User not in group", status=status.HTTP_400_BAD_REQUEST)
            contest.graderGroup.remove(user)
            return Response("Grader removed", status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class DeleteUserGroupContest(APIView) :
    def post(self, request, name, groupname, format = None) :
        if request.user.is_authenticated() :
            contest = get_object_or_404(Contest, name = name)
            if not is_owner(request.user, contest) :
                return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)          
            group = get_object_or_404(Group, name = groupname)
            if not contest.userGroups.filter(id = group.id).exists() :
                return ErrorResponse("Group not in user groups", status=status.HTTP_400_BAD_REQUEST)
            contest.userGroups.remove(group)
            return Response("Group removed", status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class DeleteGraderGroupContest(APIView) :
    def post(self, request, name, groupname, format = None) :
        if request.user.is_authenticated() :
            contest = get_object_or_404(Contest, name = name)
            if not is_owner(request.user, contest) :
                return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)          
            group = get_object_or_404(Group, name = groupname)
            if not contest.graderGroups.filter(id = group.id).exists() :
                return ErrorResponse("Group not in grader groups", status=status.HTTP_400_BAD_REQUEST)
            contest.graderGroups.remove(group)
            return Response("Group removed", status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class AddContestProblem(APIView) :
    def post(self, request, name, problemID, format = None) :
        if request.user.is_authenticated() :
            contest = get_object_or_404(Contest, name = name)
            if not is_owner(request.user, contest) :
                return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)          
            problem = get_object_or_404(Problem, problemID = problemID)
            id = contest.problems.count()+1
            cproblem = ContestProblem.objects.create(contest=contest,problem=problem,
                                                     contestProblemID = id)
            cproblem.save()
            return Response("Contest Problem added", status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class DeleteContestProblem(APIView) :
    def post(self, request, name, contestProblemID, format = None) :
        if request.user.is_authenticated() :
            contest = get_object_or_404(Contest, name = name)
            if not is_owner(request.user, contest) :
                return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)                      
            problem = get_object_or_404(ContestProblem,contest=contest, 
                                        contestProblemID = contestProblemID)
            problem.delete()
            gtProblems = ContestProblem.objects.filter(contest=contest,
                                                       contestProblemID__gt = contestProblemID)
            num = 0
            for s in gtProblems :
                s.contestProblemID -= 1
                s.save()
                num += 1
            return Response("Deleted contest problem %s and renumbered %d samples"
                            %(contestProblemID,num), status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)
    
class ReorderContestProblems(generics.GenericAPIView) :
    serializer_class = ContestProblemReorderSerializer
    queryset = {}
    def post(self, request, name, format = None) :
        if request.user.is_authenticated() :
            contest = get_object_or_404(Contest,name = name)
            if not is_owner(request.user, contest) :
                return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)                
            ser = ContestProblemReorderSerializer(data = request.data)
            if ser.is_valid() :
                newIDs = ser.validated_data['newContestProblemIDs']
                problems = ContestProblem.objects.filter(contest = contest)
                if len(problems) != len(newIDs) :
                    return ErrorResponse("Incorrect number of IDs", status=status.HTTP_400_BAD_REQUEST)
                if set(newIDs) != set(range(1,len(newIDs)+1)) :
                    return ErrorResponse("Not sequentially numbered", status=status.HTTP_400_BAD_REQUEST)
                for i in xrange(len(problems)) :
                    problems[i].contestProblemID = newIDs[i]
                    problems[i].save()
                return Response("Contest Problems Reordered Successfully", status=status.HTTP_200_OK)
            else :
                return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class SetContestProblem(generics.GenericAPIView) :
    serializer_class = ContestProblemSerializer
    queryset = {}
    def post(self, request, name, contestProblemID, format = None) :
        if request.user.is_authenticated() :
            contest = get_object_or_404(Contest, name = name)
            if not is_owner(request.user, contest) :
                return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)                      
            problem = get_object_or_404(ContestProblem,contest=contest, 
                                        contestProblemID = contestProblemID)
            ser = ContestProblemSerializer(problem,data = request.data, partial = true)
            if ser.is_valid() :
                ser.save()
                return Response("Contest Problem Updated",status=status.HTTP_200_OK)
            else :
                return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)
