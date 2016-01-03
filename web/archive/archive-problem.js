coda.controller('ArchiveProblemCtrl', [
  '$scope', '$location', '$routeParams', 'page',
  function($scope, $location, $routeParams, page) {
    page.setNav('archive');

    coda.problemInfo($scope);

    $scope.problemId = $routeParams.problemId;
  }
]);
