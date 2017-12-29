/**
 * @fileoverview Archive problem controller.
 */

coda.controller('ArchiveProblemCtrl', [
  '$location', '$routeParams', 'problem', 'page', ArchiveProblemCtrl
]);

/**
 * @param {angular.$location} $location
 * @param {angular.$routeParams} $routeParams
 * @param {coda.problem} problem
 * @param {coda.page} page
 * @constructor
 */
function ArchiveProblemCtrl($location, $routeParams, problem, page) {
  /** @type {angular.$location} */
  this.$location = $location;

  page.setNav('archive');

  /** @type {string} */
  this.problemId = $routeParams.problemId;

  /** @type {coda.Problem|undefined} */
  this.current = undefined;
  problem.getProblem(this.problemId, function(problem) {
    this.current = problem;
  }.bind(this));
}
