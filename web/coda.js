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
      .when('/archive', {
        templateUrl: 'dist/html/archive.html',
        controller: 'ArchiveCtrl'
      })
      .when('/moderator/problem/:problemId', {
        templateUrl: 'dist/html/moderator-problem.html',
        controller: 'EditProblemCtrl'
      })
      .when('/moderator/problem', {
        templateUrl: 'dist/html/moderator-problem.html',
        controller: 'AddProblemCtrl'
      })
      .when('/moderator/session/:sessionId', {
        templateUrl: 'dist/html/moderator-session.html',
        controller: 'AddSessionCtrl'
      })
      .when('/moderator/session', {
        templateUrl: 'dist/html/moderator-session.html',
        controller: 'AddSessionCtrl'
      })
      .when('/moderator', {
        templateUrl: 'dist/html/moderator.html',
        controller: 'ModeratorCtrl'
      })
      .when('/admin', {
        templateUrl: 'dist/html/admin.html',
        controller: 'AdminCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
