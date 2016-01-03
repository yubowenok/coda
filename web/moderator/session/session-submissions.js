coda.controller('SessionSubmissionsCtrl', [
  '$scope', '$location', '$routeParams', 'page',
  function($scope, $location, $routeParams, page) {
    page.setNav('moderator');

    $scope.sessionId = $routeParams.sessionId;
  }
]);
