import { Response, Request, NextFunction, Express } from 'express';
import { isAuthenticated } from '../config/passport';
import {
  isValidProblemsetId,
  isValidUsername,
  isAuthorizedUser,
  getSubmission,
  checkSubmission,
  getSubmissionList,
  getVerdict,
  getVerdictDict
} from '../util';
import { Submission, Verdict, VerdictDict, VerdictType } from '../constants';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as paths from '../constants/path';

/**
 * Creates a web format submission record, filling in verdict info.
 */
const toWebSubmission = (submission: Submission, verdict: Verdict | undefined): Object => {
  if (!verdict) {
    verdict = {
      ..._.pick(submission, ['username', 'submissionNumber', 'source']),
      failedCase: 0,
      totalCase: 0,
      verdict: VerdictType.PENDING,
      executionTime: 0,
      memory: 0
    };
  }
  return {
    ...submission,
    submitTime: new Date(submission.submitTime).getTime(),
    ...verdict
  };
};

/**
 * Creates a web format submission record with source code.
 */
const toWebSubmissionWithSource = (problemsetId: string, submission: Submission,
                                   verdict: Verdict | undefined): Object => {
  return {
    ...toWebSubmission(submission, verdict),
    source: fs.readFileSync(paths.submissionSourcePath(problemsetId, submission), 'utf8')
  };
};

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
    res.json(toWebSubmissionWithSource(problemsetId, submission, getVerdict(problemsetId, submission)));
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
        .map(submission => toWebSubmission(submission,
          submission.username in verdicts ? verdicts[submission.username][submission.submissionNumber] : undefined));
      res.json(submissions);
  });
};
