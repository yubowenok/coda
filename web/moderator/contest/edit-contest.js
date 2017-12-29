coda.controller('EditContestCtrl', ['$scope', '$routeParams', 'page',
  function($scope, $routeParams, page) {
    page.setNav('moderator');

    $scope.contestId = $routeParams.contestId;
  }
]);
