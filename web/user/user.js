/**
 * @fileoverview User controller and factory.
 */

coda.controller('UserCtrl', [
  '$scope', '$http', '$cookies', 'request', 'user',
  function($scope, $http, $cookies, request, user) {
    /** @type {boolean} */
    $scope.loggedIn = false;
    /** @type {string} */
    $scope.username = '';

    var csrftoken = $cookies.get('csrftoken');
    if (csrftoken != undefined) {
      user.login('unknown');
    }

    /**
     * Logs out the current user.
     */
    $scope.logout = function() {
      request.post(coda.url.logout, {}, {
        success: function() {
          $scope.loggedIn = false;
          $scope.username = '';
          //$cookies.remove('csrftoken');
          //$http.defaults.headers.post['X-CSRFToken'] = undefined;
        },
        successMessage: 'Logged Out'
      });
    };
  }
]);

coda.factory('user', function() {
  var $scope = angular.element('#user').scope();
  return {
    /**
     * Logs in as the given username.
     * @param {string} username
     */
    login: function(username) {
      $scope.username = username;
      $scope.loggedIn = true;
    }
  };
});
