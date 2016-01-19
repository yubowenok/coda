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
    url(r'^removeUserFromContest/(?P<name>.+)/(?P<username>.+)$', views.RemoveUserContest.as_view()),
    url(r'^removeGraderFromContest/(?P<name>.+)/(?P<username>.+)$', views.RemoveGraderContest.as_view()),
    url(r'^removeUserGroupFromContest/(?P<name>.+)/(?P<groupname>.+)$', views.RemoveUserGroupContest.as_view()),
    url(r'^removeGraderGroupFromContest/(?P<name>.+)/(?P<groupname>.+)$', views.RemoveGraderGroupContest.as_view()),

    url(r'^addContestProblem/(?P<name>.+)/(?P<problemID>.+)$', views.AddContestProblem.as_view()),
    url(r'^deleteContestProblem/(?P<name>.+)/(?P<contestProblemID>.+)$', views.DeleteContestProblem.as_view()),
    url(r'^reorderContestProblems/(?P<name>.+)$', views.ReorderContestProblems.as_view()),
    url(r'^setContestProblem/(?P<name>.+)/(?P<contestProblemID>.+)$', views.SetContestProblem.as_view()),

    url(r'^setContestBatch/(?P<name>.+)/(?P<contestProblemID>.+)/(?P<batchID>.+)$', views.SetContestBatch.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
