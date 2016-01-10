from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
import codaproblem.views as views

urlpatterns = [
    url(r'^getCheckerTypes/$', views.CheckerTypes.as_view()),
    url(r'^createProblem/$', views.CreateProblem.as_view()),
    url(r'^getProblemIDs/$', views.GetProblemIDs.as_view()),
    url(r'^getProblemInfo/(?P<problemID>.+)$', views.GetProblem.as_view()),
    url(r'^setProblemInfo/(?P<problemID>.+)$', views.SetProblem.as_view()),
    url(r'^addSample/(?P<problemID>.+)$', views.AddSample.as_view()),
    url(r'^reorderSamples/(?P<problemID>.+)$', views.ReorderSamples.as_view()),
    url(r'^deleteSample/(?P<problemID>.+)/(?P<sampleID>.+)$', views.DeleteSample.as_view()),
    url(r'^addBatch/(?P<problemID>.+)$', views.AddBatch.as_view()),
    url(r'^reorderBatches/(?P<problemID>.+)$', views.ReorderBatches.as_view()),
    url(r'^deleteBatch/(?P<problemID>.+)/(?P<batchID>.+)$', views.DeleteBatch.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)

