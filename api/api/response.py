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
        HttpResponse.__init__(self,content_type='application/octet-stream',*args,**kw)
        path = os.path.normpath(filefield.path)
        filename = os.path.basename(path)
        print >> sys.stderr, smart_str(filename) + " & "+smart_str(path)
        self['Content-disposition'] = 'attachment; filename=Exercises9.pdf'
        self['X-Sendfile'] = 'C:/xampp/htdocs/coda/datafiles/problems/Test Problem/Exercises9.pdf'
