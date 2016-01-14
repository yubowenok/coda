/**
 * @fileoverview MathJax externs.
 */

/**
 * @constructor
 */
var MathJax = function() {}

/** @const */
MathJax.Hub = {};

/**
 * @param {{
 *   tex2jax: {
 *     inlineMath: Array<!Array<string>>,
 *     displayMath: Array<!Array<string>>,
 *     skipTags: Array<string>
 *   }
 * }} params
 */
MathJax.Hub.Config = function(params){};

/**
 * @param {!Array<*>} arg
 */
MathJax.Hub.Queue = function(arg) {};
