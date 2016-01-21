/**
 * @fileoverview Coda system message controller and factory.
 */

/**
 * @param {!angular.Scope} $scope
 * @param {!angular.$timeout} $timeout
 * @constructor
 */
var MessageCtrl = function($scope, $timeout) {
  /** @type {string} */
  this.success = '';
  /** @type {string} */
  this.warning = '';
  /** @type {string} */
  this.error = '';

  /** @const {!jQuery} */
  this.container = $('#message');

  /** @type {!angular.$timeout} */
  this.$timeout = $timeout;

  $scope.$on('message.success', this.success_.bind(this));
  $scope.$on('message.warning', this.warning_.bind(this));
  $scope.$on('message.error', this.error_.bind(this));
};

/** @private @const {number} */
MessageCtrl.prototype.DEFAULT_TIMEOUT_ = 2000;

/**
 * @param {!angular.Scope.Event} event
 * @param {{
 *   text: string,
 *   timeout: (number|undefined)
 * }} params text
 * @private
 */
MessageCtrl.prototype.success_ = function(event, params) {
  var div = this.container.children('.alert-success').show();
  this.success = params.text;
  this.$timeout(function() {
    div.slideUp();
  }, params.timeout != undefined ? params.timeout : this.DEFAULT_TIMEOUT_);
};

/**
 * @param {!angular.Scope.Event} event
 * @param {{
 *   text: string,
 *   timeout: (number|undefined)
 * }} params text
 * @private
 */
MessageCtrl.prototype.warning_ = function(event, params) {
  var div = this.container.children('.alert-warning').show();
  this.warning = params.text;
  this.$timeout(function() {
    div.slideUp();
  }, params.timeout != undefined ? params.timeout : this.DEFAULT_TIMEOUT_);
};

/**
 * @param {!angular.Scope.Event} event
 * @param {{
 *   text: string,
 *   timeout: (number|undefined)
 * }} params text
 * @private
 */
MessageCtrl.prototype.error_ = function(event, params) {
  var div = this.container.children('.alert-danger').show();
  this.error = params.text;
  this.$timeout(function() {
    div.slideUp();
  }, params.timeout != undefined ? params.timeout : this.DEFAULT_TIMEOUT_);
};

/** @type {!Array<string>} */
MessageCtrl.$inject = ['$scope', '$timeout'];

coda.controller('MessageCtrl', MessageCtrl);

coda.factory('message', ['$rootScope', function($rootScope) {
  return {
    success: function(text, opt_timeout) {
      $rootScope.$broadcast('message.success', {
        text: text,
        timeout: opt_timeout
      });
    },
    warning: function(text, opt_timeout) {
      $rootScope.$broadcast('message.warning', {
        text: text,
        timeout: opt_timeout
      });
    },
    error: function(text, opt_timeout) {
      $rootScope.$broadcast('message.error', {
        text: text,
        timeout: opt_timeout
      });
    }
  };
}]);
