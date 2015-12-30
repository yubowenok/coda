coda.controller('SessionCtrl', [
  '$scope', '$location', '$routeParams', 'page',
  function($scope, $location, $routeParams, page) {
    page.setNav('sessions');

    $scope.sessionId = $routeParams.sessionId;

    $scope.problems = [
      {id: 'APLUSB', title: 'A + B', successRate: 91.62},
      {id: 'MUL', title: 'Integer Multiplication', successRate: 75.26},
      {id: 'MAXSUM', title: 'Maximum Sum', successRate: 41.62},
      {id: 'MAXSUM2', title: 'Maximum Sum II', successRate: 27.10},
      {id: 'GRAPHCUT', title: 'Graph Cutting', successRate: -1}
    ];

    /**
     * Gets an uppercase character by letter index.
     * @param {number} index
     * @return {string}
     */
    $scope.charFromIndex = function(index) {
      return String.fromCharCode('A'.charCodeAt(0) + index);
    };

    /**
     * Gets the index of an uppercase letter.
     * @param {string} char
     * @return {number}
     */
    $scope.charToIndex = function(char) {
      return char.charCodeAt(0) - 'A'.charCodeAt(0);
    };

    /**
     * Opens a problem with given index (letter) under the session.
     * @param {string} id
     */
    $scope.gotoProblem = function(index) {
      $location.path('sessions/' + $routeParams.sessionId + '/' + index);
    };
  }
]);
