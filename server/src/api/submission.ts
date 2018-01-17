import { Response, Request, NextFunction, Express } from 'express';
import {
  isAuthenticated,
  isValidProblemsetId,
  isValidUsername,
  isAuthorizedUser,
  getSubmission,
  checkSubmission,
  getSubmissionList,
  getVerdict,
  getVerdictDict,
  getJudgedSubmission,
  getJudgedSubmissionWithSource
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
    (req: Request, res: Response, next: NextFunction) => {
    const problemsetId = req.params.problemsetId;
    const username = req.params.username;
    const submissionNumber = +req.params.submissionNumber;
    if (!checkSubmission(problemsetId, username, submissionNumber)) {
      res.status(404).json({ msg: 'submission does not exist' });
    }
    const submission = getSubmission(problemsetId, username, submissionNumber);
    res.json(getJudgedSubmissionWithSource(problemsetId, submission, getVerdict(problemsetId, submission)));
  });

  /**
   * Submission list for one user
   */
  app.get('/api/problemset/:problemsetId/submissions/:username',
    isAuthenticated,
    isValidProblemsetId,
    isValidUsername,
    isAuthorizedUser,
    (req: Request, res: Response, next: NextFunction) => {
      const problemsetId = req.params.problemsetId;
      const username = req.params.username;
      const verdicts = getVerdictDict(problemsetId);
      const submissions = getSubmissionList(problemsetId, username)
        .map(submission => getJudgedSubmission(submission, verdicts && submission.username in verdicts ?
          verdicts[submission.username][submission.submissionNumber] : undefined));
      res.json(submissions);
  });
};
