coda.controller('HomeCtrl', ['$scope', 'page', function($scope, page) {
  page.setNav('home');
  $scope.activeSessions = [
    {text: 'Homework 12/23/2015'},
    {text: 'ACM-ICPC Asia-Amritapuri Onsite Mirror Contest 2015'},
    {text: 'Petrozavodsk Winter Training Camp'}
  ];
}]);
