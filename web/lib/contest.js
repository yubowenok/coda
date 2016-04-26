/**
 * @fileoverview Contest factory for fetching contests.
 */

coda.factory('contest', ['request', function(request) {
  return new ContestFactory(request);
}]);

/** @enum {string} */
coda.Scoring = {
  BINARY: 'binary',
  PROBLEM_SCORING: 'problem-scoring',
  BATCH_SCORING: 'batch-scoring'
};

/** @typedef {ContestFactory} */
coda.contest;

/**
 * @typedef {{
 *   id: string,
 *   title: string,
 *   score: number,
 *   stats: {
 *     userTotal: number,
 *     userSuccess: number
 *   }
 * }}
 */
coda.ContestProblem;

/**
 * @typedef {{
 *   id: string,
 *   title: string,
 *   description: string,
 *   startTime: (number|string),
 *   endTime: (number|string),
 *   problems: !Array<coda.ContestProblem>,
 *   scoring: coda.Scoring,
 *   name: (string|undefined)
 * }}
 * TODO(bowen): remove name?
 */
coda.Contest;

/**
 * Provides the queries to fetch contest information.
 * @param {coda.request} request
 * @constructor
 */
function ContestFactory(request) {
  /** @type {coda.request} */
  this.request = request;
}

/**
 * Fetches all contests.
 * @param {function(!Array<coda.Contest>)} success
 */
ContestFactory.prototype.getAllContests = function(success) {
  this.getContests_({
    success: success
  });
};

/**
 * Fetches a specific contest with given ID.
 * @param {string} id
 * @param {function(!Array<coda.Contest>)} success
 */
ContestFactory.prototype.getContest = function(id, success) {
  this.getContests_({
    id: id,
    success: function(contests) {
      success(_.first(contests));
    }
  });
};

/**
 * Fetches the active contests.
 * @param {function(!Array<coda.Contest>)} success
 */
ContestFactory.prototype.getActiveContests = function(success) {
  this.getContests_({
    type: 'active',
    success: success
  });
};

/**
 * Fetches the scheduled contests.
 * @param {function(!Array<coda.Contest>)} success
 */
ContestFactory.prototype.getScheduledContests = function(success) {
  this.getContests_({
    type: 'scheduled',
    success: success
  });
};

/**
 * Fetches the past contests.
 * @param {function(!Array<coda.Contest>)} success
 */
ContestFactory.prototype.getPastContests = function(success) {
  this.getContests_({
    type: 'past',
    success: success
  });
};

/**
 * Processes the retrieved contest.
 * @param {coda.Contest} contest
 * @private
 */
ContestFactory.prototype.processContest_ = function(contest) {
// Replace the endTime by reader-friendly strings.
  contest.endTime = moment(contest.endTime)
    .format('MMMM Do YYYY, h:mm a');

  if (contest.name !== undefined) {
    contest.id = contest.name;
  }
};

/**
 * Executes contest fetching.
 * @param {{
 *   id: (string|undefined),
 *   type: (string|undefined),
 *   success: function(!Array<coda.Contest>)
 * }} params
 * @private
 */
ContestFactory.prototype.getContests_ = function(params) {
  var requestParams = _.pick(params, 'id', 'type');
  this.request.get(coda.url.getContests, {
    params: requestParams,
    success: function(contests) {
      contests.forEach(function(contest) {
        this.processContest_(contest);
      }.bind(this));
      params.success(contests);
    }.bind(this)
  });
};
