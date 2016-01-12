from __future__ import unicode_literals

from django.http import HttpResponse
from django.utils.encoding import smart_str

from rest_framework.response import Response
from rest_framework import status

import os.path, sys

class ErrorResponse(Response) :
    def __init__(self, error, *args, **kw) :
        newerror = {'detail' : error}
        Response.__init__(self,newerror,*args,**kw)

class FileResponse(HttpResponse) :
    def __init__(self, filefield, *args, **kw) :
        HttpResponse.__init__(self,content_type='application/pdf')
        path = os.path.normpath(filefield.path)
        filename = os.path.basename(path)
        self['Content-Disposition'] = 'attachment; filename="%s"'%(filename)
        self['X-Sendfile'] = path
