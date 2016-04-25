/**
 * @fileoverview Contest factory for fetching contests.
 */

coda.factory('contest', ['request', function(request) {
  return new ContestFactory(request);
}]);

/** @typedef {ContestFactory} */
coda.contest;

/** @typedef {!Object} */
coda.Contest;

/**
 * @param {coda.request} request
 * @constructor
 */
function ContestFactory(request) {
  /** @type {coda.request} */
  this.request = request;
}

/**
 * Fetches all contests.
 * @param {function(!Array<coda.Contest>)} callback
 */
ContestFactory.prototype.getAllContests = function(callback) {
  this.getContests_('', callback);
};

/**
 * Fetches the active contests.
 * @param {function(!Array<coda.Contest>)} callback
 */
ContestFactory.prototype.getActiveContests = function(callback) {
  this.getContests_('active', callback);
};

/**
 * Fetches the scheduled contests.
 * @param {function(!Array<coda.Contest>)} callback
 */
ContestFactory.prototype.getScheduledContests = function(callback) {
  this.getContests_('scheduled', callback);
};

/**
 * Fetches the past contests.
 * @param {function(!Array<coda.Contest>)} callback
 */
ContestFactory.prototype.getPastContests = function(callback) {
  this.getContests_('past', callback);
};

/**
 * Executes contest fetching.
 * @param {string} type
 * @param {function(!Array<coda.Contest>)} callback
 * @private
 */
ContestFactory.prototype.getContests_ = function(type, callback) {
  var params = type === '' ? undefined : {type: type};
  this.request.get(coda.url.getContests, {
    params: params,
    success: function(contests) {
      contests.forEach(function(contest) {
        contest.endTime = moment(contest.endTime)
          .format('MMMM Do YYYY, h:mm a');
      });
      callback(contests);
    }
  });
};
