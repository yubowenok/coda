/**
 * @fileoverview Contest controller.
 */


coda.controller('ContestCtrl', [
  '$location', '$routeParams', 'contest', 'page', ContestCtrl
]);

/**
 * @param {angular.$location} $location
 * @param {angular.$routeParams} $routeParams
 * @param {coda.contest} contest
 * @param {coda.page} page
 * @constructor
 */
function ContestCtrl($location, $routeParams, contest, page) {
  /** @type {angular.$location} */
  this.$location = $location;

  page.setNav('contests');

  /** @type {string} */
  this.contestId = $routeParams.contestId;

  /** @type {coda.Contest|undefined} */
  this.current = undefined;

  contest.getContest(this.contestId, function(contest) {
    this.current = contest;
  }.bind(this));
}

/**
 * Gets an uppercase character by letter index.
 * @param {number} index
 * @return {string}
 */
ContestCtrl.prototype.charFromIndex = function(index) {
  return String.fromCharCode('A'.charCodeAt(0) + index);
};

/**
 * Gets the index of an uppercase letter.
 * @param {string} char
 * @return {number}
 */
ContestCtrl.prototype.charToIndex = function(char) {
  return char.charCodeAt(0) - 'A'.charCodeAt(0);
};

/**
 * Opens a problem with given index (letter) under the contest.
 * @param {string} index
 */
ContestCtrl.prototype.gotoProblem = function(index) {
  this.$location.path('contests/' + this.contestId + '/' + index);
};
