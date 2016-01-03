coda.controller('ProblemSubmissionsCtrl', [
  '$scope', '$location', '$routeParams', 'page',
  function($scope, $location, $routeParams, page) {
    page.setNav('moderator');

    console.log('hi');

    $scope.problemId = $routeParams.problemId;
  }
]);
