coda.controller('SessionProblemCtrl', [
  '$scope', '$location', '$routeParams', 'page',
  function($scope, $location, $routeParams, page) {
    page.setNav('sessions');

    coda.problemInfo($scope);

    $scope.problemIndex = $routeParams.problemIndex;
  }
]);


