/**
 * @fileoverview jQuery.cookie externs
 */

/**
 * @param {string} name
 * @param {*=} value
 * @param {{
 *   path: string
 * }=} options
 * @return {*}
 */
$.cookie = function(name, value, options) {};

/**
 * @param {string} name
 * @param {{
 *   path: string
 * }=} options
 */
$.removeCookie = function(name, options) {};
