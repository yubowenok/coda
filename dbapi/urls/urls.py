from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from dbapi import views

urlpatterns = [
    url(r'^auth/', include('dbapi.urls.auth')),
]
