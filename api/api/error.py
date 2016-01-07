from __future__ import unicode_literals

from rest_framework.response import Response
from rest_framework import status
from rest_framework.renderers import JSONRenderer

class ErrorResponse(Response) :
    def __init__(self, error, *args, **kw) :
        strerror = JSONRenderer().render(error)
        newerror = {'error' : {'message' : strerror}}
        Response.__init__(self,newerror,*args,**kw)
