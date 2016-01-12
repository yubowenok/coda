from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
import codaproblem.views as views

urlpatterns = [
    url(r'^getCheckerTypes/$', views.CheckerTypes.as_view()),
    url(r'^createProblem/$', views.CreateProblem.as_view()),
    url(r'^getProblemIDs/$', views.GetProblemIDs.as_view()),
    url(r'^getProblemInfo/(?P<problemID>.+)$', views.GetProblem.as_view()),
    url(r'^getPDFStatement/(?P<problemID>.+)$', views.GetPDFStatement.as_view()),
    url(r'^getChecker/(?P<problemID>.+)$', views.GetChecker.as_view()),
    url(r'^setProblemInfo/(?P<problemID>.+)$', views.SetProblem.as_view()),
    url(r'^addSample/(?P<problemID>.+)$', views.AddSample.as_view()),
    url(r'^setSample/(?P<problemID>.+)/(?P<sampleID>.+)$', views.SetSample.as_view()),
    url(r'^reorderSamples/(?P<problemID>.+)$', views.ReorderSamples.as_view()),
    url(r'^deleteSample/(?P<problemID>.+)/(?P<sampleID>.+)$', views.DeleteSample.as_view()),
    url(r'^addBatch/(?P<problemID>.+)$', views.AddBatch.as_view()),
    url(r'^setBatch/(?P<problemID>.+)/(?P<batchID>.+)$', views.SetBatch.as_view()),
    url(r'^getBatch/(?P<problemID>.+)/(?P<batchID>.+)$', views.GetBatch.as_view()),
    url(r'^reorderBatches/(?P<problemID>.+)$', views.ReorderBatches.as_view()),
    url(r'^deleteBatch/(?P<problemID>.+)/(?P<batchID>.+)$', views.DeleteBatch.as_view()),
    url(r'^addTestFile/(?P<problemID>.+)/(?P<batchID>.+)$', views.AddTestFile.as_view()),
    url(r'^setTestFile/(?P<problemID>.+)/(?P<batchID>.+)/(?P<testFileID>.+)$', views.SetTestFile.as_view()),
    url(r'^reorderTestFiles/(?P<problemID>.+)/(?P<batchID>.+)$', views.ReorderTestFiles.as_view()),
    url(r'^deleteTestFile/(?P<problemID>.+)/(?P<batchID>.+)/(?P<testFileID>.+)$', views.DeleteTestFile.as_view()),
    url(r'^getTestFileInput/(?P<problemID>.+)/(?P<batchID>.+)/(?P<testFileID>.+)$', views.GetTestFileInput.as_view()),
    url(r'^getTestFileOutput/(?P<problemID>.+)/(?P<batchID>.+)/(?P<testFileID>.+)$', views.GetTestFileInput.as_view()),
    url(r'^getTestFileResources/(?P<problemID>.+)/(?P<batchID>.+)/(?P<testFileID>.+)$', views.GetTestFileInput.as_view()),

]

urlpatterns = format_suffix_patterns(urlpatterns)

