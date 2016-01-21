/**
 * @fileoverview Coda request factory that provides network request wrappers.
 */

/**
 * @typedef {{
 *   status: number,
 *   responseJSON: *
 * }}
 */
coda.RequestResult;

/**
 * @typedef {{
 *   success: (Function|undefined),
 *   error: (Function|undefined),
 *   successMessage: (string|undefined),
 *   errorMessage: (string|undefined),
 *   noErrorDisplay: (boolean|undefined)
 * }}
 */
coda.RequestOptions;

coda.factory('request', RequestFactory);

/**
 * @param {angular.$http} $http
 * @param {coda.message} message
 * @constructor
 */
function RequestFactory($http, message) {
  /**
   * @param {*} data
   * @param {number} status
   * @param {coda.RequestOptions} options
   * @private
   */
  var success_ = function(data, status, options) {
    console.log(data, status);
    if (options.successMessage) {
      message.success(options.successMessage);
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
  var error_ = function(data, status, options) {
    console.log(data, status);
    if (!options.noErrorDisplay) {
      var messages = [
        '[' + status + ']',
        data.detail
      ];
      if (options.errorMessage) {
        messages.push(options.errorMessage);
      }
      message.error(messages.join(' '));
    }
    if (options.error) {
      options.error(data);
    }
  };

  return {
    /**
     * @param {string} url
     * @param {coda.RequestOptions} options
     */
    get: function(url, options) {
      $http.get(url)
        .success(function(data, status) {
          success_(data, status, options);
        })
        .error(function(data, status) {
          error_(data, status, options);
        });
    },
    /**
     * @param {string} url
     * @param {!Object} params
     * @param {coda.RequestOptions} options
     */
    post: function(url, params, options) {
      $http.post(url, params)
        .success(function(data, status) {
          success_(data, status, options);
        }).error(function(data, status) {
          error_(data, status, options);
        });
    }
  };
}

/** @type {!Array<string>} */
RequestFactory.$inject = ['$http', 'message'];
