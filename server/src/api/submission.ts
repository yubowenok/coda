import { Response, Request, Express } from 'express';
import {
  isAuthenticated,
  isValidProblemsetId,
  isValidUsername,
  isAuthorizedUser,
  getSubmission,
  checkSubmission,
  getSubmissionList,
  getProblemset,
  getVerdict,
  getVerdictDict,
  getJudgedSubmission,
  getJudgedSubmissionWithSource,
  updateVerdictForBlindJudge,
  updateVerdictsForBlindJudge
} from '../util';

module.exports = function(app: Express) {
  /**
   * Single submission
   */
  app.get('/api/problemset/:problemsetId/submission/:username/:submissionNumber',
    isAuthenticated,
    isValidProblemsetId,
    isValidUsername,
    isAuthorizedUser,
    (req: Request, res: Response) => {
    const problemsetId = req.params.problemsetId;
    const username = req.params.username;
    const submissionNumber = +req.params.submissionNumber;
    if (!checkSubmission(problemsetId, username, submissionNumber)) {
      return res.status(404).json({ msg: 'submission does not exist' });
    }
    const submission = getSubmission(problemsetId, username, submissionNumber);
    const judgedSubmission = getJudgedSubmissionWithSource(problemsetId, submission,
      getVerdict(problemsetId, submission));

    updateVerdictForBlindJudge(getProblemset(problemsetId), judgedSubmission);
    res.json(judgedSubmission);
  });

  /**
   * Submission list for one user
   */
  app.get('/api/problemset/:problemsetId/submissions/:username',
    isAuthenticated,
    isValidProblemsetId,
    isValidUsername,
    isAuthorizedUser,
    (req: Request, res: Response) => {
      const problemsetId = req.params.problemsetId;
      const username = req.params.username;
      const verdicts = getVerdictDict(problemsetId);
      const judgedSubmissions = getSubmissionList(problemsetId, username)
        .map(submission => getJudgedSubmission(submission, verdicts && submission.username in verdicts ?
          verdicts[submission.username][submission.submissionNumber] : undefined));

      updateVerdictsForBlindJudge(getProblemset(problemsetId), judgedSubmissions);
      res.json(judgedSubmissions);
  });
};
