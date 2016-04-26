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
        controller: 'HomeCtrl as home'
      })

      // Contests pages
      .when('/contests', {
        templateUrl: 'dist/html/contests/contests.html',
        controller: 'ContestsCtrl as contests'
      })
      .when('/contests/:contestId', {
        templateUrl: 'dist/html/contests/contest.html',
        controller: 'ContestCtrl as contest'
      })
      .when('/contests/:contestId/:problemIndex', {
        templateUrl: 'dist/html/contests/contest-problem.html',
        controller: 'ContestProblemCtrl as contestProblem'
      })

      // Archive pages
      .when('/archive/:problemId', {
        templateUrl: 'dist/html/archive/archive-problem.html',
        controller: 'ArchiveProblemCtrl as archiveProblem'
      })
      .when('/archive', {
        templateUrl: 'dist/html/archive/archive.html',
        controller: 'ArchiveCtrl as archive'
      })

      // Moderator pages
      .when('/moderator', {
        templateUrl: 'dist/html/moderator/moderator.html',
        controller: 'ModeratorCtrl as moderator'
      })
      // Moderator - problem
      .when('/moderator/problem', {
        templateUrl: 'dist/html/moderator/problem/problem.html',
        controller: 'AddProblemCtrl as addProblem'
      })
      .when('/moderator/problem/:problemId', {
        templateUrl: 'dist/html/moderator/problem/problem.html',
        controller: 'EditProblemCtrl as editProblem'
      })
      .when('/moderator/problem/:problemId/submissions', {
        templateUrl: 'dist/html/moderator/problem/problem-submissions.html',
        controller: 'ProblemSubmissionsCtrl as problemSubmission'
      })
      .when('/moderator/problem/:problemId/tests', {
        templateUrl: 'dist/html/moderator/tests/tests.html',
        controller: 'TestsCtrl as tests'
      })
      // Moderator - contest
      .when('/moderator/contest', {
        templateUrl: 'dist/html/moderator/contest/contest.html',
        controller: 'AddContestCtrl as addContest'
      })
      .when('/moderator/contest/:contestId', {
        templateUrl: 'dist/html/moderator/contest/contest.html',
        controller: 'EditContestCtrl as editContest'
      })
      .when('/moderator/contest/:contestId/submissions', {
        templateUrl: 'dist/html/moderator/contest/contest-submissions.html',
        controller: 'ContestSubmissionsCtrl as contestSubmission'
      })

      // Admin pages
      .when('/admin', {
        templateUrl: 'dist/html/admin/admin.html',
        controller: 'AdminCtrl as admin'
      })

      // User
      .when('/register', {
        templateUrl: 'dist/html/user/register.html',
        controller: 'RegisterCtrl as register'
      })
      .when('/login', {
        templateUrl: 'dist/html/user/login.html',
        controller: 'LoginCtrl as login'
      })

      .otherwise({
        redirectTo: '/'
      });
  }
]);
