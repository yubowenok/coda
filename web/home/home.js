coda.controller('HomeCtrl', [
  '$scope', '$location', 'page',
  function($scope, $location, page) {
    page.setNav('home');

    coda.contests($scope, 'active');

    /**
     * Opens a contest with a given id.
     * @param {string} id
     */
    $scope.gotoContest = function(id) {
      $location.path('contests/' + id);
    };
  }
]);
