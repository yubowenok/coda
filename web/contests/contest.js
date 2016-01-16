coda.controller('ContestCtrl', [
  '$scope', '$location', '$routeParams', 'page',
  function($scope, $location, $routeParams, page) {
    page.setNav('contests');

    coda.contestInfo($scope);

    $scope.contestId = $routeParams.contestId;
    $scope.contestTitle = 'Contest Title';

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
     * Opens a problem with given index (letter) under the contest.
     * @param {string} index
     */
    $scope.gotoProblem = function(index) {
      $location.path('contests/' + $routeParams.contestId + '/' + index);
    };
  }
]);
