from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
import codacontest.views as views

urlpatterns = [
    url(r'^getScoringSystems/$', views.ScoringSystems.as_view()),
    url(r'^getContests/$', views.GetContests.as_view()),
    url(r'^createContest/$', views.CreateContest.as_view()),
    url(r'^setContestInfo/(?P<name>.+)$', views.SetContest.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
