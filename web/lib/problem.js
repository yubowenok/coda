/**
 * @fileoverview Problem factory for fetching problem info.
 */

coda.factory('problem', ['request', function(request) {
  return new ProblemFactory(request);
}]);

/** @typedef {ProblemFactory} */
coda.problem;

/** @enum {string} */
coda.Language = {
  C: 'c',
  CPP: 'c++',
  JAVA: 'java',
  PYTHON: 'python'
};

/**
 * @typedef {{
 *   input: string,
 *   output: string,
 *   sampleId: number
 * }}
 */
coda.Sample;

/**
 * @typedef {{
 *   constraints: string
 * }}
 */
coda.Batch;

/**
 * @typedef {{
 *   id: string,
 *   onlyExec: boolean
 * }}
 */
coda.Checker;

/**
 * @typedef {{
 *   id: string,
 *   title: string,
 *   description: string,
 *   input: string,
 *   output: string,
 *   timeLimit: number,
 *   memoryLimit: number,
 *   usePdf: boolean,
 *   checkerType: coda.Checker,
 *   explanation: string,
 *   languages: !Array<coda.Language>,
 *   samples: !Array<coda.Sample>,
 *   batches: !Array<coda.Batch>,
 *   problemID: (string|undefined)
 * }}
 * TODO(bowen): remove problemID?
 */
coda.Problem;

/**
 * @param {coda.request} request
 * @constructor
 */
function ProblemFactory(request) {
  /** @type {coda.request} */
  this.request = request;
}

/**
 * Processes the retrieved problem info.
 * @param {coda.Problem} problem
 * @private
 */
ProblemFactory.prototype.processProblem_ = function(problem) {
  // TODO(bowen): may need to compute success rate, which is however contest
  // dependent
  //problem.successRate = problem.stats.userSuccess / problem.stats.userTotal;

  if (problem.problemID !== undefined) {
    problem.id = problem.problemID;
  }
  if (problem.name !== undefined) {
    problem.id = problem.name;
  }
};

/**
 * Fetches the problem info for a given id.
 * @param {string} id
 * @param {function(coda.Problem)} success
 */
ProblemFactory.prototype.getProblem = function(id, success) {
  this.request.get(coda.url.getProblemInfo + '/' + id, {
    success: function(problem) {
      this.processProblem_(problem);
      success(problem);
    }.bind(this)
  });
};

/**
 * Fetches the problem info with contest id and problem index.
 * @param {string} contestId
 * @param {string} problemIndex
 * @param {function(coda.Problem)} success
 */
ProblemFactory.prototype.getContestProblem = function(contestId, problemIndex,
  success) {
  this.request.get(coda.url.getContestProblemInfo, {
    params: {
      contestId: contestId,
      problemIndex: problemIndex
    },
    success: function(problem) {
      this.processProblem_(problem);
      success(problem);
    }.bind(this)
  });
};
