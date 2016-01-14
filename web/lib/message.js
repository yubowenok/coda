/**
 * @fileoverview Coda system message controller and factory.
 */

coda.controller('MessageCtrl', ['$scope', function($scope) {
  /** @type {string} */
  $scope.success = '';

  /** @type {string} */
  $scope.warning = '';

  /** @type {string} */
  $scope.error = '';
}]);

coda.factory('message', function() {
  var $scope = angular.element('#message').scope();
  return {
    /**
     * @param {string} text
     */
    success: function(text) {
      $scope.success = text;
    },
    /**
     * @param {string} text
     */
    warning: function(text) {
      $scope.warning = text;
    },
    /**
     * @param {string} text
     */
    error: function(text) {
      $scope.error = text;
    }
  };
});
