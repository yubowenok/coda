from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
import codaauth.views as views

urlpatterns = [
    url(r'^registerUser/$', views.RegisterUser.as_view()),
    url(r'^login/$', views.Login.as_view()),
    url(r'^logout/$', views.Logout.as_view()),
    url(r'^changePassword/$', views.ChangePassword.as_view()),
    url(r'^getAllUsers/$', views.GetAllUsers.as_view()),
    url(r'^createUserGroup/$', views.CreateUserGroup.as_view()),
    url(r'^addUserToGroup/(?P<username>.+)/(?P<groupname>.+)$', views.AddUserToGroup.as_view()),
    url(r'^removeUserFromGroup/(?P<username>.+)/(?P<groupname>.+)$', views.RemoveUserFromGroup.as_view()),
    url(r'^removeGroup/(?P<groupname>.+)$', views.RemoveGroup.as_view()),
    url(r'^renameGroup/(?P<groupname>.+)$', views.RenameGroup.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)

