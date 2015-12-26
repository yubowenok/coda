var coda = angular.module('coda', [
  'ngRoute'
]);

coda.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: 'dist/html/home.html',
        controller: 'HomeCtrl'
      })
      .when('/sessions', {
        templateUrl: 'dist/html/sessions.html',
        controller: 'SessionsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
