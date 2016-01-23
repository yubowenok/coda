from __future__ import unicode_literals

from rest_framework import serializers
from rest_framework.exceptions import *

from django.contrib.auth.models import User, Group

from codasubmission.models import *
from codascorecard.models import *

class SubmitSerializer(serializers.ModelSerializer) :
    def save(self, **kw) :
        vdata = self.validated_data
        vdata.update(**kw)
        cp = vdata['problem']
        lang = vdata['language']
        
        if not cp.contest.languages.filter(id = lang.id).exists() :
            raise ValidationError("Language not supported by contest")
        if not cp.problem.languges.filter(id = lang.id).exists() :
            raise ValidationError("Language not supported by problem")
        
        subser = SubmitSerializer.objects.create(**vdata)
        sub = subser.save()

        #Obtain user lock to serialize submissions by a single user
        Users.objects.select_for_update().get(id = sub.user.id)
                
        isFirst = True
        for cb in cp.batches.all() :
            bsc = getBatchSC(contestProblem = cp, contestBatch = cb)
            if isFirst :
                isFirst = False
                bsc.addSubmission()
                #Create all results for first batch
                br = createBatchResults(bsc,cp,cb,sub)
                #create queue jobs
                for tfr in br.testFileResults.all() :
                    tfj = TestFileJob.objects.create(
                        testFileResult = tfr,
                        submission = sub,
                        submissionTime = sub.submissionTime
                    )
                    tfj.save()

    class Meta:
        model = ContestSubmission
        read_only_fields = (user, submissionTime, problem)
