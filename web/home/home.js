/**
 * @fileoverview Home controller.
 */

coda.controller('HomeCtrl', [
  '$scope', '$location', 'page', 'request', HomeCtrl
]);

/**
 * @param {!angular.Scope} $scope
 * @param {angular.$location} $location
 * @param {coda.page} page
 * @param {coda.contest} contest
 * @constructor
 */
function HomeCtrl($scope, $location, page, contest) {
  page.setNav('home');

  contest.getActiveContests(function(contests) {
    this.activeContests = contests;
  }.bind(this));

  /** @type {angular.$location} */
  this.$location = $location;
}

/**
 * Opens a contest with a given id.
 * @param {string} id
 */
HomeCtrl.prototype.gotoContest = function(id) {
  this.$location.path('contests/' + id);
};
