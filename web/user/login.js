coda.controller('LoginCtrl', [
  '$scope', '$location', 'page', 'request', 'user',
  function($scope, $location, page, request, user) {
    page.setNav('login');

    /** @type {string} */
    $scope.username = '';
    /** @type {string} */
    $scope.password = '';

    /**
     * Logins the user.
     */
    $scope.login = function() {
      var passwordHash = CryptoJS.SHA256($scope.username).toString();
      var params = {
        username: $scope.username,
        password: passwordHash
      };
      request.post(coda.url.login, params, {
        success: function() {
          user.login($scope.username);
          $location.path('/');
        },
        successMessage: 'Login Successful'
      });
    };
  }
]);
