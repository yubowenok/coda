coda.controller('AddProblemCtrl', ['$scope', '$location', 'page',
  function($scope, $location, page) {
    page.setNav('moderator');
    $scope.isAddProblem = true;
    $scope.submit = function() {
      $location.path('moderator/problem/' + $('.set-problem #id').val());
    };
  }
]);
