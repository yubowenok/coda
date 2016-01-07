from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
import codaproblem.views as views

urlpatterns = [
    url(r'^getCheckerTypes/$', views.CheckerTypes.as_view()),
    url(r'^createProblem/$', views.CreateProblem.as_view()),
    url(r'^setPDF/$', views.SetPDF.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)

