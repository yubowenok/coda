/**
 * @fileoverview Coda server urls.
 */

/** @const */
coda.url = {};

/** @const {string} */
coda.url.server = 'https://localhost/coda/api/';

/** @const {string} */
coda.url.auth = coda.url.server + 'auth/';
/** @const {string} */
coda.url.contest = coda.url.server + 'contest/';
/** @const {string} */
coda.url.problem = coda.url.server + 'problem/';
/** @const {string} */
coda.url.util = coda.url.server + 'util/';


// auth
/** @const {string} */
coda.url.registerUser = coda.url.auth + 'registerUser/';
/** @const {string} */
coda.url.login = coda.url.auth + 'login/';
/** @const {string} */
coda.url.logout = coda.url.auth + 'logout/';
/** @const {string} */
coda.url.existsUsername = coda.url.auth + 'existsUsername/';
/** @const {string} */
coda.url.getUserInfo = coda.url.auth + 'getUserInfo/';
/** @const {string} */
coda.url.changePassword = coda.url.auth + 'changePassword/';
/** @const {string} */
coda.url.createUserGroup = coda.url.auth + 'createUserGroup/';
/** @const {string} */
coda.url.addUserToGroup = coda.url.auth + 'addUserToGroup/';
/** @const {string} */
coda.url.removeUserFromGroup = coda.url.auth + 'removeUserFromGroup/';
/** @const {string} */
coda.url.removeUserGroup = coda.url.auth + 'removeUserGroup/';
/** @const {string} */
coda.url.renameUserGroup = coda.url.auth + 'renameUserGroup/';
/** @const {string} */


// contest
/** @const {string} */
coda.url.getScoringSystems = coda.url.contest + 'getScoringSystems/';
/** @const {string} */
coda.url.getContests = coda.url.contest + 'getContests/';
/** @const {string} */
coda.url.createContest = coda.url.contest + 'createContest/';
/** @const {string} */
coda.url.setContestInfo = coda.url.contest + 'setContestInfo/';
/** @const {string} */
coda.url.addUserToContest = coda.url.contest + 'addUserToContest/';
/** @const {string} */
coda.url.addGraderToContest = coda.url.contest + 'addGraderToContest/';
/** @const {string} */
coda.url.addUserGroupToContest = coda.url.contest + 'addUserGroupToContest/';
/** @const {string} */
coda.url.removeUserFromContest = coda.url.contest + 'removeUserFromContest/';
/** @const {string} */
coda.url.removeGraderFromContest = coda.url.contest +
  'removeGraderFromContest/';
/** @const {string} */
coda.url.removeUserGroupFromContest = coda.url.contest +
  'removeUserGroupFromContest/';
/** @const {string} */
coda.url.removeGraderGroupFromContest = coda.url.contest +
  'removeGraderGroupFromContest/';
/** @const {string} */
coda.url.addContestProblem = coda.url.contest + 'addContestProblem/';
/** @const {string} */
coda.url.deleteContestProblem = coda.url.contest + 'deleteContestProblem/';
/** @const {string} */
coda.url.reorderContestProblems = coda.url.contest + 'reorderContestProblems/';
/** @const {string} */
coda.url.setContestProblem = coda.url.contest + 'setContestProblem/';
/** @const {string} */
coda.url.setContestBatch = coda.url.contest + 'setContestBatch/';


// problem
/** @const {string} */
coda.url.getCheckerTypes = coda.url.problem + 'getCheckerTypes/';
/** @const {string} */
coda.url.getLanguages = coda.url.problem + 'getLanguages/';
/** @const {string} */
coda.url.getProblemIDs = coda.url.problem + 'getProblemIDs/';
/** @const {string} */
coda.url.getProblemInfo = coda.url.problem + 'getProblemInfo/';
/** @const {string} */
coda.url.getContestProblemInfo = coda.url.problem + 'getContestProblemInfo/';
/** @const {string} */
coda.url.getPDFStatement = coda.url.problem + 'getPDFStatement/';
/** @const {string} */
coda.url.getChecker = coda.url.problem + 'getChecker/';
/** @const {string} */
coda.url.setProblemInfo = coda.url.problem + 'setProblemInfo/';
/** @const {string} */
coda.url.addSample = coda.url.problem + 'addSample/';
/** @const {string} */
coda.url.setSample = coda.url.problem + 'setSample/';
/** @const {string} */
coda.url.reorderSamples = coda.url.problem + 'reorderSamples/';
/** @const {string} */
coda.url.deleteSample = coda.url.problem + 'deleteSample/';
/** @const {string} */
coda.url.addBatch = coda.url.problem + 'addBatch/';
/** @const {string} */
coda.url.setBatch = coda.url.problem + 'setBatch/';
/** @const {string} */
coda.url.getBatch = coda.url.problem + 'setBatch/';
/** @const {string} */
coda.url.reorderBatches = coda.url.problem + 'reorderBatches/';
/** @const {string} */
coda.url.deleteBatch = coda.url.problem + 'deleteBatch/';
/** @const {string} */
coda.url.addTestFile = coda.url.problem + 'addTestFile/';
/** @const {string} */
coda.url.setTestFile = coda.url.problem + 'setTestFile/';
/** @const {string} */
coda.url.reorderTestFiles = coda.url.problem + 'reorderTestFiles/';
/** @const {string} */
coda.url.deleteTestFile = coda.url.problem + 'deleteTestFile/';
/** @const {string} */
coda.url.getTestFileInput = coda.url.problem + 'getTestFileInput/';
/** @const {string} */
coda.url.getTestFileOutput = coda.url.problem + 'getTestFileOutput/';
/** @const {string} */
coda.url.getTestFileResources = coda.url.problem + 'getTestFileResources/';


// util
/** @const {string} */
coda.url.serverTime = coda.url.util + 'serverTime/';
