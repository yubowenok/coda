coda.controller('ContestsCtrl', ['$scope', '$location', 'page',
  function($scope, $location, page) {
    page.setNav('contests');

    coda.contests($scope, 'active');
    coda.contests($scope, 'scheduled');
    coda.contests($scope, 'past');

    /**
     * Opens a contest with the given id.
     * @param {string} id
     */
    $scope.gotoContest = function(id) {
      $location.path('contests/' + id);
    };
  }
]);
