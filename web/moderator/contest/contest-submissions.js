coda.controller('ContestSubmissionsCtrl', [
  '$scope', '$location', '$routeParams', 'page',
  function($scope, $location, $routeParams, page) {
    page.setNav('moderator');

    $scope.contestId = $routeParams.contestId;
  }
]);
