/**
 * @fileoverview Dummy data creation for dev purpose.
 */

/**
 * Writes dummy problem data under $scope.
 * @param {!angular.Scope} $scope
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
 * Writes dummy active contests under $scope.
 * @param {!angular.Scope} $scope
 * @param {string} type
 */
coda.contests = function($scope, type) {
  if (type == 'active') {
    $scope.activeContests = [
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
  } else if (type == 'scheduled') {
    $scope.scheduledContests = [
      {id: 'FN122515', text: 'Friday Night 12/25/2015'}
    ];
  } else if (type == 'past') {
    $scope.pastContests = [
      {id: 'HW121615', text: 'Homework 12/16/2015'},
      {id: 'HW120915', text: 'Homework 12/09/2015'}
    ];
  }
};


/**
 * Writes dummy contest info under $scope.
 * @param {!angular.Scope} $scope
 */
coda.contestInfo = function($scope) {
  $scope.contestTitle = 'Contest Title';
  $scope.problems = [
    {id: 'APLUSB', title: 'A + B', successRate: 91.62},
    {id: 'MUL', title: 'Integer Multiplication', successRate: 75.26},
    {id: 'MAXSUM', title: 'Maximum Sum', successRate: 41.62},
    {id: 'MAXSUM2', title: 'Maximum Sum II', successRate: 27.10},
    {id: 'GRAPHCUT', title: 'Graph Cutting', successRate: -1}
  ];
};

/**
 * Writes dummy moderator contests data under $scope.
 * @param {!angular.Scope} $scope
 */
coda.moderatorContests = function($scope) {
  $scope.contests = [
    {id: 'HW122315', text: 'Homework 12/23/2015'},
    {id: 'DL122315', text: 'Daily Challenge 12/23/2015'}
  ];
};

/**
 * Writes dummy moderator problems data under $scope.
 * @param {!angular.Scope} $scope
 */
coda.moderatorProblems = function($scope) {
  $scope.problems = [
    {id: 'APLUSB', title: 'A + B', successRate: 91.62},
    {id: 'MUL', title: 'Integer Multiplication', successRate: 75.26},
  ];
};
