coda.controller('AdminCtrl', [
  '$scope', 'page',
  function($scope, page) {
    page.setNav('admin');

    /**
     * Starts the judge.
     */
    $scope.startJudge = function() {
    };

    /**
     * Stops the judge.
     */
    $scope.stopJudge = function() {
    };
  }
]);
