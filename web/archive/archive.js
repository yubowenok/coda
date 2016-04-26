/**
 * @fileoverview Problem archive controller.
 */

coda.controller('ArchiveCtrl', ['$location', 'contest', 'page', ArchiveCtrl]);

/**
 * @param {angular.$location} $location
 * @param {coda.contest} contest
 * @param {coda.page} page
 * @constructor
 */
function ArchiveCtrl($location, contest, page) {
  /** @type {angular.$location} */
  this.$location = $location;

  page.setNav('archive');

  /** @type {!Array<coda.Problem>} */
  this.problems = [];

  contest.getContest('ARCHIVE', function(contest) {
    this.problems = contest.problems;
  });
}

/**
 * Opens a problem from the archive.
 * @param {string} id
 */
ArchiveCtrl.prototype.gotoProblem = function(id) {
  this.$location.path('archive/' + id);
};
