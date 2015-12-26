coda.controller('SessionsCtrl', ['$scope', 'page', function($scope, page) {
  page.setNav('sessions');
  $scope.activeSessions = [
    {text: 'Homework 12/23/2015'},
    {text: 'ACM-ICPC Asia-Amritapuri Onsite Mirror Contest 2015'},
    {text: 'Petrozavodsk Winter Training Camp'}
  ];
  $scope.scheduledSessions = [
    {text: 'Friday Night 12/25/2015'}
  ];
  $scope.finishedSessions = [
    {text: 'Homework 12/16/2015'},
    {text: 'Homework 12/09/2015'}
  ];
}]);
