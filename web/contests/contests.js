/**
 * @fileoverview Contests list controller.
 */

coda.controller('ContestsCtrl', ['$location', 'contest', 'page', ContestsCtrl]);

/**
 * @param {angular.$location} $location
 * @param {coda.contest} contest
 * @param {coda.page} page
 * @constructor
 */
function ContestsCtrl($location, contest, page) {
  /** @type {angular.$location} */
  this.$location = $location;

  page.setNav('contests');

  contest.getActiveContests(function(contests) {
    this.activeContests = contests;
  }.bind(this));
  contest.getScheduledContests(function(contests) {
    this.scheduledContests = contests;
  }.bind(this));
  contest.getPastContests(function(contests) {
    this.pastContests = contests;
  }.bind(this));
}

/**
 * Opens a contest with the given id.
 * @param {string} id
 */
ContestsCtrl.prototype.gotoContest = function(id) {
  this.$location.path('contests/' + id);
};
