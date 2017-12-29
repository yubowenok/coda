/**
 * @fileoverview Login controller.
 */

coda.controller('LoginCtrl', ['page', 'user', LoginCtrl]);

/**
 * @param {coda.page} page
 * @param {coda.user} user
 * @constructor
 */
function LoginCtrl(page, user) {
  /** @type {coda.user} */
  this.user = user;

  page.setNav('login');

  /** @type {string} */
  this.username = '';
  /** @type {string} */
  this.password = '';
}

/**
 * Logins the user.
 */
LoginCtrl.prototype.login = function() {
  var params = {
    username: this.username,
    password: this.password
  };
  this.user.login(params);
};

