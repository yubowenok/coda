/**
 * @fileoverview Contest problem controller.
 */

coda.controller('ContestProblemCtrl', [
  '$location', '$routeParams', 'problem', 'page', ContestProblemCtrl
]);


/**
 * @param {angular.$location} $location
 * @param {angular.$routeParams} $routeParams
 * @param {coda.problem} problem
 * @param {coda.page} page
 * @constructor
 */
function ContestProblemCtrl($location, $routeParams, problem, page) {
  /** @type {angular.$location} */
  this.$location = $location;

  page.setNav('contests');

  /** @type {string} */
  this.contestId = $routeParams.contestId;
  /** @type {string} */
  this.problemIndex = $routeParams.problemIndex;

  /** @type {coda.Problem|undefined} */
  this.current = undefined;

  problem.getContestProblem(this.contestId, this.problemIndex,
    function(problem) {
      this.current = problem;
    }.bind(this));
}
