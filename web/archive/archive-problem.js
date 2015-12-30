coda.controller('ArchiveProblemCtrl', [
  '$scope', '$location', '$routeParams', 'page',
  function($scope, $location, $routeParams, page) {
    page.setNav('archive');

    $scope.problemId = $routeParams.problemId;
  }
]);
