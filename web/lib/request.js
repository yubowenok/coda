/**
 * @fileoverview Coda request factory that provides network request wrappers.
 */

coda.factory('request', ['message', function(message) {
  return {
    /**
     * @param {string} url
     * @param {!Object} params
     * @param {{
     *   callback: (Function|undefined),
     *   successMessage: (string|undefined),
     *   failureMessage: (string|undefined),
     * }} options
     */
    get: function(url, params, options) {
      $.get(url, params)
        .done(function() {
          if (options.successMessage) {
            message.success(options.successMessage);
          }
          if (options.callback) {
            options.callback();
          }
        })
        .fail(function() {
          var messages = [];
          if (options.failureMessage) {
            messages.push(options.failureMessage);
          }
          message.error(messages.join(', '));
        });
    },
    /**
     * @param {string} url
     * @param {!Object} params
     * @param {{
     *   callback: (Function|undefined),
     *   successMessage: (string|undefined),
     *   failureMessage: (string|undefined),
     * }} options
     */
    post: function(url, params, options) {
      $.post(url, params)
        .done(function() {
          if (options.callback) {
            options.callback();
          }
        })
        .fail(function() {
          var messages = [];
          if (options.failureMessage) {
            messages.push(options.failureMessage);
          }
          message.error(messages.join(', '));
        });
    }
  };
}]);
