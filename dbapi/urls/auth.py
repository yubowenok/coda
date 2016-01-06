from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from dbapi import views

urlpatterns = [
    url(r'^registerUser/$', views.auth.RegisterUser.as_view()),
    url(r'^login/$', views.auth.Login.as_view()),
    url(r'^logout/$', views.auth.Logout.as_view()),
    url(r'^changePassword/$', views.auth.ChangePassword.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)

