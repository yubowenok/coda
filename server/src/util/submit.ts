import * as fs from 'fs';
import * as path from 'path';
import * as paths from '../constants/path';
import { Submission, BlindJudgeStatus } from '../constants/submission';

/**
 * Marks skipped solutions w.r.t. the new submission.
 */
export const updateStatusForBlindJudge = (submissions: Submission[], newSubmission: Submission): void => {
  if (newSubmission.outsideProblemsetTime) {
    return; // do nothing if upsolving
  }
  newSubmission.blindJudgeStatus = BlindJudgeStatus.FINAL;
  submissions.forEach(submission => {
    if (submission.username === newSubmission.username &&
      submission.problemNumber === newSubmission.problemNumber &&
      submission.subtask === newSubmission.subtask) {
      submission.blindJudgeStatus = BlindJudgeStatus.SKIPPED;
    }
  });
};

/**
 * Writes the submission source code to file. Creates directory if it doesn't exist.
 */
export const writeSubmission = (problemsetId: string, username: string, sourceName: string,
                                sourceCode: string): void => {
  const sourceDir = paths.problemsetSourceDir(problemsetId);
  if (!fs.existsSync(sourceDir)) {
    fs.mkdirSync(sourceDir);
  }
  const userDir = path.join(sourceDir, username);
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir);
  }
  fs.writeFileSync(paths.submissionSavePath(problemsetId, username, sourceName), sourceCode, 'utf8');
};
/**
 * Writes the list submissions out as json.
 */
export const writeSubmissions = (problemsetId: string, submissions: Submission[]): void => {
  fs.writeFileSync(paths.problemsetSubmissionsPath(problemsetId),
    JSON.stringify(submissions, undefined, 2));
};
