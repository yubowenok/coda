from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
import codacontest.views as views

urlpatterns = [
    url(r'^getScoringSystems/$', views.ScoringSystems.as_view()),
    url(r'^getContests/$', views.GetContests.as_view()),
    url(r'^createContest/$', views.CreateContest.as_view()),
    url(r'^setContestInfo/(?P<name>.+)$', views.SetContest.as_view()),

    url(r'^addUserToContest/(?P<name>.+)/(?P<username>.+)$', views.AddUserContest.as_view()),
    url(r'^addGraderToContest/(?P<name>.+)/(?P<username>.+)$', views.AddGraderContest.as_view()),
    url(r'^addUserGroupToContest/(?P<name>.+)/(?P<groupname>.+)$', views.AddUserGroupContest.as_view()),
    url(r'^addGraderGroupToContest/(?P<name>.+)/(?P<groupname>.+)$', views.AddGraderGroupContest.as_view()),
    url(r'^deleteUserFromContest/(?P<name>.+)/(?P<username>.+)$', views.DeleteUserContest.as_view()),
    url(r'^deleteGraderFromContest/(?P<name>.+)/(?P<username>.+)$', views.DeleteGraderContest.as_view()),
    url(r'^deleteUserGroupFromContest/(?P<name>.+)/(?P<groupname>.+)$', views.DeleteUserGroupContest.as_view()),
    url(r'^deleteGraderGroupFromContest/(?P<name>.+)/(?P<groupname>.+)$', views.DeleteGraderGroupContest.as_view()),

    url(r'^addContestProblem/(?P<name>.+)/(?P<problemID>.+)$', views.AddContestProblem.as_view()),
    url(r'^deleteContestProblem/(?P<name>.+)/(?P<contestProblemID>.+)$', views.DeleteContestProblem.as_view()),
    url(r'^reorderContestProblems/(?P<name>.+)$', views.ReorderContestProblems.as_view()),
    url(r'^setContestProblem/(?P<name>.+)/(?P<contestProblemID>.+)$', views.SetContestProblem.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
