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

coda.factory('request', ['$http', '$rootScope', 'message',
  function($http, $rootScope, message) {
    return {
      /**
       * @param {string} url
       * @param {!Object} params
       * @param {{
       *   success: (Function|undefined),
       *   successMessage: (string|undefined),
       *   failureMessage: (string|undefined),
       * }} options
       */
      post: function(url, params, options) {
        $http({
          url: url,
          method: 'POST',
          data: params
        }).success(function(data, status, headers, config) {
          console.log(data, status, headers, config);
          if (options.successMessage) {
            message.success(options.successMessage);
          }
          if (options.success) {
            options.success(data);
          }
        }).error(function(data, status, headers, config) {
          console.log(data, status, headers, config);
          var messages = [
            '[' + status + ']',
            data.detail
          ];
          if (options.failureMessage) {
            messages.push(options.failureMessage);
          }
          message.error(messages.join(' '));
        });
      }
    };
  }
]);
