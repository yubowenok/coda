from __future__ import unicode_literals

import uuid, sys

from rest_framework import serializers
from rest_framework.exceptions import *

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
        
        #Obtain user level lock? Maybe earlier?
        
        isFirst = True
        for cb in cp.batches.all() :
            bsc = getBatchSC(contestProblem = cp, contestBatch = cb)
            if isFirst :
                isFirst = False
                bsc.addSubmission()
                #Create all results for first batch
                br = createBatchResults(bsc,cp,cb,sub)
                #create queue jobs

    class Meta:
        model = ContestSubmission
        read_only_fields = (user, submissionTime, problem)
