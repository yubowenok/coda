coda.controller('HomeCtrl', [
  '$scope', '$location', 'page',
  function($scope, $location, page) {
    page.setNav('home');

    coda.activeSession($scope);

    /**
     * Opens a session with a given id.
     * @param {string} id
     */
    $scope.gotoSession = function(id) {
      $location.path('sessions/' + id);
    };
  }
]);
