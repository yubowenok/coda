import { Response, Request, Express } from 'express';
import {
  isAuthenticated,
  isValidProblemsetId,
  isAuthorizedUser,
  getSubmissionList,
  getVerdictDict,
  getJudgedSubmission
} from '../util';

module.exports = function(app: Express) {
  /**
   * All submissions for a problemset
   */
  app.get('/api/problemset/:problemsetId/queue/',
    isAuthenticated,
    isValidProblemsetId,
    isAuthorizedUser,
    (req: Request, res: Response) => {
      if (!req.user.isAdmin) {
        return res.status(401).json({ msg: 'access denied' });
      }
      const problemsetId = req.params.problemsetId;
      const verdicts = getVerdictDict(problemsetId);
      const judgedSubmissions = getSubmissionList(problemsetId)
        .map(submission => {
          const sub = getJudgedSubmission(problemsetId, submission,
            verdicts && submission.username in verdicts ?
              verdicts[submission.username][submission.submissionNumber] : undefined);
          sub.username = submission.username;
          return sub;
        });

      res.json(judgedSubmissions);
    });
};
