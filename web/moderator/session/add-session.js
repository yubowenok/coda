coda.controller('AddSessionCtrl', ['$scope', '$location', 'page',
  function($scope, $location, page) {
    page.setNav('moderator');
    $scope.isAddSession = true;

    /**
     * Submits a new session Id.
     */
    $scope.submit = function() {
      $location.path('moderator/session/' + $('.moderator-form #id').val());
    };
  }
]);
