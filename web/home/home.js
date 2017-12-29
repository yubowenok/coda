/**
 * @fileoverview Home controller.
 */

coda.controller('HomeCtrl', ['$location', 'page', 'contest', HomeCtrl]);

/**
 * @param {angular.$location} $location
 * @param {coda.page} page
 * @param {coda.contest} contest
 * @constructor
 */
function HomeCtrl($location, page, contest) {
  /** @type {angular.$location} */
  this.$location = $location;

  page.setNav('home');

  contest.getActiveContests(function(contests) {
    this.activeContests = contests;
  }.bind(this));
}

/**
 * Opens a contest with a given id.
 * @param {string} id
 */
HomeCtrl.prototype.gotoContest = function(id) {
  this.$location.path('contests/' + id);
};
