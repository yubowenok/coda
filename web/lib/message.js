/**
 * @fileoverview Coda system message controller and factory.
 */

coda.controller('MessageCtrl', ['$scope', '$timeout', MessageCtrl]);

coda.factory('message', ['$rootScope', function($rootScope) {
  return new MessageFactory($rootScope);
}]);

/** @typedef {MessageFactory} */
coda.message;

/**
 * @param {!angular.Scope} $scope
 * @param {!angular.$timeout} $timeout
 * @constructor
 */
function MessageCtrl($scope, $timeout) {
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
}

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

/**
 * @param {!angular.Scope} $rootScope
 * @constructor
 */
function MessageFactory($rootScope) {
  /** @type {!angular.Scope} */
  this.$rootScope = $rootScope;
}

/**
 * @param {string} text
 * @param {number=} opt_timeout
 */
MessageFactory.prototype.success = function(text, opt_timeout) {
  this.$rootScope.$broadcast('message.success', {
    text: text,
    timeout: opt_timeout
  });
};

/**
 * @param {string} text
 * @param {number=} opt_timeout
 */
MessageFactory.prototype.warning = function(text, opt_timeout) {
  this.$rootScope.$broadcast('message.warning', {
    text: text,
    timeout: opt_timeout
  });
};

/**
 * @param {string} text
 * @param {number=} opt_timeout
 */
MessageFactory.prototype.error = function(text, opt_timeout) {
  this.$rootScope.$broadcast('message.error', {
    text: text,
    timeout: opt_timeout
  });
};
