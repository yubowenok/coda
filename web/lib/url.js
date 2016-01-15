/**
 * @fileoverview Coda server urls.
 */

/** @const */
coda.url = {};

/** @const {string} */
coda.url.server = 'https://localhost/coda/api/';

/** @const {string} */
coda.url.auth = coda.url.server + 'auth/';

/** @const {string} */
coda.url.login = coda.url.auth + 'login/';

/** @const {string} */
coda.url.logout = coda.url.auth + 'logout/';

/** @const {string} */
coda.url.registerUser = coda.url.auth + 'registerUser/';

/** @const {string} */
coda.url.existUsername = coda.url.auth + 'existUsername/';
