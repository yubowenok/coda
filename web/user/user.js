/**
 * @fileoverview User controller and factory.
 */

coda.controller('UserCtrl', [
  '$scope', '$http', 'request', 'user',
  function($scope, $http, request, user) {
    /** @type {boolean} */
    $scope.loggedIn = false;
    /** @type {string} */
    $scope.username = '';

    var csrftoken = $.cookie('csrftoken');
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
          $http.defaults.headers.post['X-CSRFToken'] = '';
          $.removeCookie('csrftoken', {path: '/'});
        },
        successMessage: 'Logged Out'
      });
    };
  }
]);

coda.factory('user', ['$http', function($http) {
  var $scope = angular.element('#user').scope();
  return {
    /**
     * Logs in as the given username.
     * @param {string} username
     */
    login: function(username) {
      $scope.username = username;
      $scope.loggedIn = true;
      $http.defaults.headers.post['X-CSRFToken'] = $.cookie('csrftoken');
    }
  };
}]);
