from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
import codaauth.views as views

urlpatterns = [
    url(r'^registerUser/$', views.RegisterUser.as_view()),
    url(r'^login/$', views.Login.as_view()),
    url(r'^logout/$', views.Logout.as_view()),
    url(r'^changePassword/$', views.ChangePassword.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)

