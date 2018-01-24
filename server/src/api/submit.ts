import { Response, Request, Express } from 'express';
import { MappedError } from 'express-validator/shared-typings';
import * as paths from '../constants/path';

import {
  isAuthenticated,
  isValidProblemsetId,
  isValidProblemNumber,
  isValidSubtask,
  getSubmissionList,
  getUserSubmissionList,
  getProblemset,
  getProblemsetTime,
  checkProblemsetEnded,
  updateStatusForBlindJudge,
  writeSubmission,
  writeSubmissions
} from '../util';
import {
  Submission,
  LanguageList,
  JudgeMode
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

    const problemsetId = req.params.problemsetId;
    const problemNumber = req.params.problemNumber;
    const subtask = req.params.subtask;
    const language = req.body.language;
    const username = req.user.username;
    const problemset = getProblemset(problemsetId);
    const submissions = getSubmissionList(problemsetId);
    const previousSubmissionCount = submissions.length;

    // Computes the new submission number.
    const userSubmissions = getUserSubmissionList(problemsetId, username);
    const submissionNumber = userSubmissions.length ?
      userSubmissions[userSubmissions.length - 1].submissionNumber + 1 : 1;

    const sourceName = paths.submissionFileName(username, submissionNumber, problemNumber, subtask, language);
    try {
      writeSubmission(problemsetId, username, sourceName, req.body.sourceCode);
    } catch (err) {
      return res.status(500).json({ msg: 'FATAL: cannot save source file' });
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

    if (problemset.judgeMode === JudgeMode.BLIND) {
      // find all submissions to a same subtask before and mark them skipped
      updateStatusForBlindJudge(submissions, newSubmission);
    }

    // write to submissions.json
    const newSubmissions = submissions.concat(newSubmission);

    if (newSubmissions.length !== previousSubmissionCount + 1) {
      return res.status(500).json({ msg: 'FATAL: submission count fails safety check' });
    }

    try {
      writeSubmissions(problemsetId, newSubmissions);
    } catch (Err) {
      return res.status(500).json({ msg: 'FATAL: cannot save submissions' });
    }

    return res.json(submissionNumber);
  });
};
