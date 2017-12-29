from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics

class SubmitProblem(generics.GenericAPIView) :
    serializer_class = SubmitSerializer
    queryset = {}
    
    def post(self, request, name, contestProblemID, format = None) :        
    #check time: must be after start time ... can be after end time
        if request.user.is_authenticated() :
            contest = get_object_or_404(Contest, name = name)
            if not is_owner(request.user, contest) : #replace with elig check
                return ErrorResponse("Not Authorized", status=status.HTTP_403_FORBIDDEN)                      
            cproblem = get_object_or_404(ContestProblem,contest=contest, 
                                        contestProblemID = contestProblemID)
            ser = SubmitSerializer(data = request.data)
            if ser.is_valid() :                
                ser.save(user = request.user, problem = cproblem)
                return Response("Submitted Solution",status=status.HTTP_200_OK)
            else :
                return ErrorResponse(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)

class PopJobQueue(APIView) :
    def post(self, request, format = None) :        
        #check that user is a judge
        if request.user.is_authenticated() :
            job = TestFileJob.objects.select_for_update().all()[:1][0]
            ser = TestFileJobSerializer(job)
            job.delete()
            return Response(ser.data, status=status.HTTP_200_OK)
        else :
            return ErrorResponse("Not Logged In", status=status.HTTP_403_FORBIDDEN)
    
