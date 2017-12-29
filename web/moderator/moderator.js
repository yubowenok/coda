coda.controller('ModeratorCtrl', [
  '$scope', '$location', 'page',
  function($scope, $location, page) {
    page.setNav('moderator');

    coda.moderatorContests($scope);
    coda.moderatorProblems($scope);

    /**
     * Opens a problem editing page.
     * @param {string} id
     */
    $scope.editProblem = function(id) {
      $location.path('moderator/problem/' + id);
    };

    /**
     * Opens a contest editing page.
     * @param {string} id
     */
    $scope.editContest = function(id) {
      $location.path('moderator/contest/' + id);
    };
  }
]);
