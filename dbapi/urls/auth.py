from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from dbapi import views

urlpatterns = [
    url(r'^registerUser/$', views.auth.RegisterUser),
]

urlpatterns = format_suffix_patterns(urlpatterns)

