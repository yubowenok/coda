import { Response, Request, Express } from 'express';
import {
  isAuthenticated,
  isValidProblemsetId,
  isValidUsername,
  isAuthorizedUser,
  getSubmission,
  checkSubmission,
  getUserSubmissionList,
  getProblemset,
  getVerdict,
  getVerdictDict,
  getJudgedSubmission,
  getJudgedSubmissionWithSource,
  updateVerdictForBlindJudge,
  updateVerdictsForBlindJudge,
  checkProblemsetEnded
} from '../util';
import { ScoreboardMode } from '../constants/problemset';

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
    const problemset = getProblemset(problemsetId);
    const username = req.params.username;
    const submissionNumber = +req.params.submissionNumber;
    if (!checkSubmission(problemsetId, username, submissionNumber)) {
      return res.status(404).json({ msg: 'submission does not exist' });
    }
    const submission = getSubmission(problemsetId, username, submissionNumber);
    const judgedSubmission = getJudgedSubmissionWithSource(problemsetId, submission,
      getVerdict(problemsetId, submission));

    if (problemset.scoreboardMode !== ScoreboardMode.ENABLED && req.user.username !== username) {
      if (req.user.isAdmin) {
        judgedSubmission.adminView = true;
      } else {
        // cannot view submission if scoreboard is not ENABLED
        return res.status(401).json({ msg: 'access denied' });
      }
    }

    if (!checkProblemsetEnded(problemset)) {
      if (req.user.isAdmin) {
        judgedSubmission.adminView = true;
      } else {
        updateVerdictForBlindJudge(getProblemset(problemsetId), judgedSubmission);
      }
    }

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
      const problemset = getProblemset(problemsetId);
      const username = req.params.username;
      const verdicts = getVerdictDict(problemsetId);
      const judgedSubmissions = getUserSubmissionList(problemsetId, username)
        .map(submission => getJudgedSubmission(problemsetId, submission,
          verdicts && submission.username in verdicts ?
            verdicts[submission.username][submission.submissionNumber] : undefined));

      if (problemset.scoreboardMode !== ScoreboardMode.ENABLED && req.user.username !== username) {
        if (!req.user.isAdmin) {
          // cannot view submission if scoreboard is not ENABLED
          return res.status(401).json({ msg: 'access denied' });
        }
      }

      if (!checkProblemsetEnded(problemset)) {
        if (!req.user.isAdmin) {
          updateVerdictsForBlindJudge(problemset, judgedSubmissions);
        }
      }

      res.json(judgedSubmissions);
  });
};
