/**
 * @fileoverview Coda module and routes.
 */

/** @type {!angular.Module} */
var coda = angular.module('coda', [
  'ngRoute', 'ngCookies'
]);

coda.config(['$httpProvider', '$routeProvider', '$locationProvider',
  function($httpProvider, $routeProvider, $locationProvider) {
    //$httpProvider.defaults.withCredentials = true;

    $locationProvider.html5Mode(true);
    $routeProvider
      // Home page
      .when('/', {
        templateUrl: 'dist/html/home/home.html',
        controller: 'HomeCtrl'
      })

      // Contests pages
      .when('/contests', {
        templateUrl: 'dist/html/contests/contests.html',
        controller: 'ContestsCtrl'
      })
      .when('/contests/:contestId', {
        templateUrl: 'dist/html/contests/contest.html',
        controller: 'ContestCtrl'
      })
      .when('/contests/:contestId/:problemIndex', {
        templateUrl: 'dist/html/contests/problem.html',
        controller: 'ContestProblemCtrl'
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
        templateUrl: 'dist/html/moderator/problem/problem.html',
        controller: 'AddProblemCtrl'
      })
      .when('/moderator/problem/:problemId', {
        templateUrl: 'dist/html/moderator/problem/problem.html',
        controller: 'EditProblemCtrl'
      })
      .when('/moderator/problem/:problemId/submissions', {
        templateUrl: 'dist/html/moderator/problem/problem-submissions.html',
        controller: 'ProblemSubmissionsCtrl'
      })
      .when('/moderator/problem/:problemId/tests', {
        templateUrl: 'dist/html/moderator/tests/tests.html',
        controller: 'TestsCtrl'
      })
      // Moderator - contest
      .when('/moderator/contest', {
        templateUrl: 'dist/html/moderator/contest/contest.html',
        controller: 'AddContestCtrl'
      })
      .when('/moderator/contest/:contestId', {
        templateUrl: 'dist/html/moderator/contest/contest.html',
        controller: 'EditContestCtrl'
      })
      .when('/moderator/contest/:contestId/submissions', {
        templateUrl: 'dist/html/moderator/contest/contest-submissions.html',
        controller: 'ContestSubmissionsCtrl'
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
  }
]);

/**
 * @typedef {{
 *   csrftoken: string
 * }}
 */
coda.Cookies;

coda.run(['$http', '$cookies',
  function($http, $cookies) {
    var csrftoken = $cookies.get('csrftoken');
    if (csrftoken != undefined) {
      $http.defaults.headers.post['X-CSRFToken'] = csrftoken;
    }
  }
]);
