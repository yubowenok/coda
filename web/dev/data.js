/**
 * @fileoverview Dummy data creation for dev purpose.
 */

/**
 * Writes dummy problem data under $scope.
 * @param {!angular.scope} $scope
 */
coda.problemInfo = function($scope) {
  $scope.problemId = 'APLUSB';

  $scope.statement =
    'Given two positive integers $$a$$ and $$b$$, compute $$a+b$$.' +
    '\n#### some markdown header\nsome _awesome_ **markdown**';

  $scope.input = 'The input has a single line containing two space ' +
    'separated integers, $$a$$ and $$b$$.';

  $scope.output = 'Output a single integer for each case, $$a+b$$.';

  $scope.samples = [
    {input: '1 2\n', output: '3\n'},
    {input: '3 5\n', output: '8\n'}
  ];
};

/**
 * Writes dummy active sessions under $scope.
 * @param {!angular.scope} $scope
 */
coda.activeSession = function($scope) {
  $scope.activeSessions = [
    {
      id: 'HW122315',
      text: 'Homework 12/23/2015'
    },
    {
      id: 'AMRITAPURI15',
      text: 'ACM-ICPC Asia-Amritapuri Onsite Mirror Contest 2015'
    },
    {
      id: 'DL122315',
      text: 'Daily Challenge 12/23/2015'
    }
  ];
};


/**
 * Writes dummy session info under $scope.
 * @param {!angular.scope} $scope
 */
coda.sessionInfo = function($scope) {
  $scope.sessionTitle = 'Session Title';
  $scope.problems = [
    {id: 'APLUSB', title: 'A + B', successRate: 91.62},
    {id: 'MUL', title: 'Integer Multiplication', successRate: 75.26},
    {id: 'MAXSUM', title: 'Maximum Sum', successRate: 41.62},
    {id: 'MAXSUM2', title: 'Maximum Sum II', successRate: 27.10},
    {id: 'GRAPHCUT', title: 'Graph Cutting', successRate: -1}
  ];
};

