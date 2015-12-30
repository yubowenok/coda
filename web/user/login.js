coda.controller('LoginCtrl', [
  '$scope', '$location', 'page',
  function($scope, $location, page) {
    page.setNav('login');

    /**
     * Logins the user.
     */
    $scope.login = function() {
    };
  }
]);
