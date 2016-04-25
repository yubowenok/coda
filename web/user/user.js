/**
 * @fileoverview User controller and factory.
 */

coda.controller('UserCtrl', ['$http', 'user', UserCtrl]);

coda.factory('user', ['$http', '$location', 'request',
  function($http, $location, request) {
    return new UserFactory($http, $location, request);
  }
]);

/** @typedef {UserFactory} */
coda.user;

/**
 * @param {angular.$http} $http
 * @param {coda.user} user
 * @constructor
 */
function UserCtrl($http, user) {
  /** @type {angular.$http} */
  this.$http = $http;

  /** @type {coda.user} */
  this.user = user;


  var csrftoken = $.cookie('csrftoken');
  if (csrftoken != undefined) {
    user.authenticate();
  }
}

/**
 * Logs out the current user.
 */
UserCtrl.prototype.logout = function() {
  this.user.logout();
};

/**
 * Checks if the user is currently logged in.
 * @return {boolean}
 */
UserCtrl.prototype.isLoggedIn = function() {
  return this.user.loggedIn;
};

/**
 * Returns the currently logged in username.
 * @returns {string}
 */
UserCtrl.prototype.getUsername = function() {
  return this.user.username;
};

/**
 * @param {angular.$http} $http
 * @param {angular.$location} $location
 * @param {coda.request} request
 * @constructor
 */
function UserFactory($http, $location, request) {
  /** @type {angular.$http} */
  this.$http = $http;
  /** @type {angular.$location} */
  this.$location = $location;
  /** @type {coda.request} */
  this.request = request;

  /** @type {boolean} */
  this.loggedIn = false;
  /** @type {string} */
  this.username = '';
}

/**
 * Authenticates the current user with cookies.
 */
UserFactory.prototype.authenticate = function() {
  this.request.get(coda.url.getUserInfo, {
    success: function(info) {
      this.setLogin(info.username);
    }.bind(this)
  });
};

/**
 * Logs in the user with password.
 * @param {{username: string, password: string}} params
 */
UserFactory.prototype.login = function(params) {
  this.request.post(coda.url.login, {
    params: params,
    success: function(info) {
      this.setLogin(info.username);
      this.$location.path('/');
    }.bind(this),
    successMessage: 'Login Successful'
  });
};

/**
 * Logs out the current user (client side).
 */
UserFactory.prototype.logout = function() {
  this.request.post(coda.url.logout, {
    success: function() {
      this.loggedIn = false;
      this.username = '';
      this.$http.defaults.headers.post['X-CSRFToken'] = '';
      $.removeCookie('csrftoken', {path: '/'});
    }.bind(this),
    successMessage: 'Logged Out'
  });
};

/**
 * Updates client side logged in information.
 * @param {string} username
 */
UserFactory.prototype.setLogin = function(username) {
  this.username = username;
  this.loggedIn = true;
  this.$http.defaults.headers.post['X-CSRFToken'] = $.cookie('csrftoken');
};
