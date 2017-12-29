coda.controller('EditProblemCtrl', ['$scope', '$routeParams', 'page',
  function($scope, $routeParams, page) {
    page.setNav('moderator');

    $scope.problemId = $routeParams.problemId;
  }
]);
