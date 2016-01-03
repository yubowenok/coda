coda.controller('AddProblemCtrl', ['$scope', '$location', 'page',
  function($scope, $location, page) {
    page.setNav('moderator');
    $scope.isAddProblem = true;

    /**
     * Submits a new problem Id.
     */
    $scope.submit = function() {
      $location.path('moderator/problem/' + $('.moderator-form #id').val());
    };
  }
]);
