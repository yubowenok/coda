coda.controller('EditSessionCtrl', ['$scope', '$routeParams', 'page',
  function($scope, $routeParams, page) {
    page.setNav('moderator');

    $scope.sessionId = $routeParams.sessionId;
  }
]);
