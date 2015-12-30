coda.controller('SessionProblemCtrl', [
  '$scope', '$location', '$routeParams', 'page',
  function($scope, $location, $routeParams, page) {
    page.setNav('sessions');

    $scope.problemIndex = $routeParams.problemIndex;
  }
]);
