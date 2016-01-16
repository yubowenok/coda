coda.controller('ContestProblemCtrl', [
  '$scope', '$location', '$routeParams', 'page',
  function($scope, $location, $routeParams, page) {
    page.setNav('contests');

    coda.problemInfo($scope);

    $scope.problemIndex = $routeParams.problemIndex;
  }
]);


