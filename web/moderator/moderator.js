coda.controller('ModeratorCtrl', [
  '$scope', '$location', 'page',
  function($scope, $location, page) {
    page.setNav('moderator');

    $scope.sessions = [
      {id: 'HW122315', text: 'Homework 12/23/2015'},
      {id: 'DL122315', text: 'Daily Challenge 12/23/2015'}
    ];

    $scope.problems = [
      {id: 'APLUSB', title: 'A + B', successRate: 91.62},
      {id: 'MUL', title: 'Integer Multiplication', successRate: 75.26},
    ];

    /**
     * Opens a problem editing page.
     * @param {string} id
     */
    $scope.editProblem = function(id) {
      $location.path('moderator/problem/' + id);
    };

    /**
     * Opens a session editing page.
     * @param {string} id
     */
    $scope.editSession = function(id) {
      $location.path('moderator/session/' + id);
    };
  }
]);
