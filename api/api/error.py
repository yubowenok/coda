from __future__ import unicode_literals

from rest_framework.response import Response
from rest_framework import status

class ErrorResponse(Response) :
    def __init__(self, error, *args, **kw) :
        newerror = {'detail' : error}
        Response.__init__(self,newerror,*args,**kw)

