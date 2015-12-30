var coda = angular.module('coda', [
  'ngRoute'
]);

coda.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      // Home page
      .when('/', {
        templateUrl: 'dist/html/home/home.html',
        controller: 'HomeCtrl'
      })

      // Sessions pages
      .when('/sessions', {
        templateUrl: 'dist/html/sessions/sessions.html',
        controller: 'SessionsCtrl'
      })
      .when('/sessions/:sessionId', {
        templateUrl: 'dist/html/sessions/session.html',
        controller: 'SessionCtrl'
      })
      .when('/sessions/:sessionId/:problemIndex', {
        templateUrl: 'dist/html/sessions/problem.html',
        controller: 'SessionProblemCtrl'
      })

      // Archive pages
      .when('/archive/:problemId', {
        templateUrl: 'dist/html/archive/problem.html',
        controller: 'ArchiveProblemCtrl'
      })
      .when('/archive', {
        templateUrl: 'dist/html/archive/archive.html',
        controller: 'ArchiveCtrl'
      })
      // Moderator pages
      .when('/moderator', {
        templateUrl: 'dist/html/moderator/moderator.html',
        controller: 'ModeratorCtrl'
      })
      // Moderator - problem
      .when('/moderator/problem', {
        templateUrl: 'dist/html/moderator/problem.html',
        controller: 'AddProblemCtrl'
      })
      .when('/moderator/problem/:problemId', {
        templateUrl: 'dist/html/moderator/problem.html',
        controller: 'EditProblemCtrl'
      })
      .when('/moderator/problem/:problemId/submissions', {
        templateUrl: 'dist/html/moderator/problem-submissions.html',
        controller: 'ProblemSubmissionsCtrl'
      })
      .when('/moderator/problem/:problemId/tests', {
        templateUrl: 'dist/html/moderator/tests.html',
        controller: 'TestsCtrl'
      })
      // Moderator - session
      .when('/moderator/session', {
        templateUrl: 'dist/html/moderator/session.html',
        controller: 'AddSessionCtrl'
      })
      .when('/moderator/session/:sessionId', {
        templateUrl: 'dist/html/moderator/session.html',
        controller: 'EditSessionCtrl'
      })
      .when('/moderator/session/:sessionId/submissions', {
        templateUrl: 'dist/html/moderator/session-submissions.html',
        controller: 'SessionSubmissionsCtrl'
      })

      // Admin pages
      .when('/admin', {
        templateUrl: 'dist/html/admin/admin.html',
        controller: 'AdminCtrl'
      })

      // User
      .when('/register', {
        templateUrl: 'dist/html/user/register.html',
        controller: 'RegisterCtrl'
      })
      .when('/login', {
        templateUrl: 'dist/html/user/login.html',
        controller: 'LoginCtrl'
      })

      .otherwise({
        redirectTo: '/'
      });
  }]);
