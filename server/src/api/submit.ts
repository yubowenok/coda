import { Response, Request, Express } from 'express';
import { MappedError } from 'express-validator/shared-typings';
import * as paths from '../constants/path';

import {
  isAuthenticated,
  isValidProblemsetId,
  isValidProblemNumber,
  isValidSubtask,
  getSubmissionList,
  getProblemset,
  getProblemsetTime,
  checkProblemsetEnded,
  updateStatusForBlindJudge,
  writeSubmission,
  writeSubmissions
} from '../util';
import {
  Submission,
  LanguageList
} from '../constants';

module.exports = function(app: Express) {
  app.post('/api/problemset/:problemsetId/problem/:problemNumber/submit/:subtask',
    isAuthenticated,
    isValidProblemsetId,
    isValidProblemNumber,
    isValidSubtask,
    (req: Request, res: Response) => {
    req.check('language', 'must be in a valid language').isIn(LanguageList);
    const errors = req.validationErrors() as MappedError[];
    if (errors) {
      return res.status(500).json({ msg: errors[0].msg });
    }

    // TODO: mark skipped submissions for blind judge
    const problemsetId = req.params.problemsetId;
    const problemNumber = req.params.problemNumber;
    const subtask = req.params.subtask;
    const language = req.body.language;
    const username = req.user.username;
    const problemset = getProblemset(problemsetId);
    const submissions = getSubmissionList(problemsetId, username);

    // Computes the new submission number.
    const submissionNumber = submissions.length ?
      submissions[submissions.length - 1].submissionNumber + 1 : 1;

    const sourceName = paths.submissionFileName(username, submissionNumber, problemNumber, subtask, language);
    try {
      writeSubmission(problemsetId, username, sourceName, req.body.sourceCode);
    } catch (err) {
      return res.status(500).json({ msg: 'cannot save source file' });
    }

    const newSubmission: Submission = {
      username: username,
      problemNumber: problemNumber,
      submissionNumber: submissionNumber,
      subtask: subtask,
      language: language,
      problemsetTime: getProblemsetTime(problemset),
      submitTime: new Date().toString(),
      sourceFile: sourceName
    };
    if (checkProblemsetEnded(problemset)) {
      newSubmission.outsideProblemsetTime = true;
    }

    // find all submissions to a same subtask before and mark them skipped
    updateStatusForBlindJudge(submissions, newSubmission);

    // write to submissions.json
    writeSubmissions(problemsetId, submissions.concat(newSubmission));

    return res.json(submissionNumber);
  });
};
