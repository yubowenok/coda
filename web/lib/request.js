/**
 * @fileoverview Coda request factory that provides network request wrappers.
 */

coda.factory('request', ['$http', 'message', function($http, message) {
  return new RequestFactory($http, message);
}]);

/** @typedef {RequestFactory} */
coda.request;

/**
 * @typedef {{
 *   status: number,
 *   responseJSON: *
 * }}
 */
coda.RequestResult;

/**
 * @typedef {{
 *   params: (Object|undefined),
 *   success: (Function|undefined),
 *   error: (Function|undefined),
 *   successMessage: (string|undefined),
 *   errorMessage: (string|undefined),
 *   noErrorDisplay: (boolean|undefined)
 * }}
 */
coda.RequestOptions;

/**
 * @param {angular.$http} $http
 * @param {coda.message} message
 * @constructor
 */
function RequestFactory($http, message) {
  /** @type {angular.$http} */
  this.$http = $http;

  /** @type {coda.message} */
  this.message = message;
}

/**
 * @param {*} data
 * @param {number} status
 * @param {coda.RequestOptions} options
 * @private
 */
RequestFactory.prototype.success_ = function(data, status, options) {
  console.log(data, status);
  if (options.successMessage) {
    this.message.success(options.successMessage);
  }
  if (options.success) {
    options.success(data);
  }
};

/**
 * @param {*} data
 * @param {number} status
 * @param {coda.RequestOptions} options
 * @private
 */
RequestFactory.prototype.error_ = function(data, status, options) {
  console.log(data, status);
  if (!options.noErrorDisplay) {
    var messages = [
      '[' + status + ']',
      data.detail
    ];
    if (options.errorMessage) {
      messages.push(options.errorMessage);
    }
    this.message.error(messages.join(' '));
  }
  if (options.error) {
    options.error(data);
  }
};

/**
 * @param {string} url
 * @param {coda.RequestOptions} options
 */
RequestFactory.prototype.get = function(url, options) {
  this.$http.get(url, {
    params: options.params
  }).success(function(data, status) {
      this.success_(data, status, options);
    }.bind(this))
    .error(function(data, status) {
      this.error_(data, status, options);
    }.bind(this));
};

/**
 * @param {string} url
 * @param {coda.RequestOptions} options
 */
RequestFactory.prototype.post = function(url, options) {
  this.$http.post(url, options.params)
    .success(function(data, status) {
      this.success_(data, status, options);
    }.bind(this))
    .error(function(data, status) {
      this.error_(data, status, options);
    }.bind(this));
};
