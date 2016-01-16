coda.controller('AddContestCtrl', ['$scope', '$location', 'page',
  function($scope, $location, page) {
    page.setNav('moderator');
    $scope.isAddContest = true;

    /**
     * Submits a new contest Id.
     */
    $scope.submit = function() {
      $location.path('moderator/contest/' + $('.moderator-form #id').val());
    };
  }
]);
