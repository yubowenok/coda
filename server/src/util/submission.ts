import * as path from 'path';
import * as paths from '../constants/path';
import * as fs from 'fs';
import { Submission, SubmissionDict, Verdict, VerdictDict } from '../constants/submission';

/**
 * Reads submission.json and gets all submissions for a problemset;
 */
const getSubmissions = (problemsetId: string): Submission[] => {
  return JSON.parse(
    fs.readFileSync(paths.problemsetSubmissionsPath(problemsetId), 'utf8'));
};

/**
 * Reads verdicts.json and gets all verdicts for a problemset.
 */
const getVerdicts = (problemsetId: string): Verdict[] => {
  return JSON.parse(
    fs.readFileSync(paths.problemsetVerdictsPath(problemsetId), 'utf8'));
};

/**
 * @returns List of submissions (for the username) inside a problemset, sorted by submission order.
 */
export const getSubmissionList = (problemsetId: string, username?: string): Submission[] => {
  let submissions = getSubmissions(problemsetId);
  if (username) {
    submissions = submissions.filter(submission => submission.username === username);
  }
  return submissions;
};

/**
 * @returns A dictionary mapping username to her submissions.
 */
export const getSubmissionDict = (problemsetId: string): SubmissionDict => {
  const dict: SubmissionDict = {};
  getSubmissions(problemsetId).forEach((submission: Submission) => {
    if (!(submission.username in dict)) {
      dict[submission.username] = [];
    }
    dict[submission.username].push(submission);
  });
  return dict;
};

/**
 * Checks if the (username, submission number) pair is valid.
 */
export const checkSubmission = (problemsetId: string, username: string, submissionNumber: number): boolean => {
  if (!fs.existsSync(paths.problemsetSubmissionsPath(problemsetId))) {
    return false; // no submissions yet
  }
  const dict = getSubmissionDict(problemsetId);
  if (!(username in dict)) {
    return false;
  }
  return dict[username].map(submission => submission.submissionNumber)
    .indexOf(submissionNumber) !== -1;
};

/**
 *  Gets a particular submission, assuming parameters are valid.
 */
export const getSubmission = (problemsetId: string, username: string, submissionNumber: number): Submission => {
  const dict = getSubmissionDict(problemsetId);
  let submission: Submission;
  dict[username].forEach(sub => {
    if (sub.submissionNumber === submissionNumber) {
      submission = sub;
    }
  });
  if (!submission) {
    console.error('invalid parameters passed to getSubmission');
  }
  return submission;
};

/**
 * Gets the verdicts as a two-level dictionary.
 * First maps username to her verdict dictionary.
 * Then maps the user's submission number to the verdict.
 */
export const getVerdictDict = (problemsetId: string): VerdictDict => {
  const dict: VerdictDict = {};
  getVerdicts(problemsetId).forEach(verdict => {
    if (!(verdict.username in dict)) {
      dict[verdict.username] = {};
    }
    dict[verdict.username][verdict.submissionNumber] = verdict;
  });
  return dict;
};

/**
 * Checks if a verdict exists.
 */
export const checkVerdict = (problemsetId: string, username?: string, submissionNumber?: number): boolean => {
  if (!fs.existsSync(paths.problemsetVerdictsPath(problemsetId))) {
    return false; // no verdicts yet
  }
  const dict = getVerdictDict(problemsetId);
  if (username && !(username in dict)) {
    return false;
  }
  if (submissionNumber && !(submissionNumber in dict[username])) {
    return false;
  }
  return true;
};

/**
 * Gets the verdict object for one submission.
 * This reads the whole verdicts.json file. For repeating queries over verdicts, use getVerdictDict instead.
 */
export const getVerdict = (problemsetId: string, submission: Submission): Verdict | undefined => {
  if (!checkVerdict(problemsetId, submission.username, submission.submissionNumber)) {
    return undefined;
  }
  return getVerdictDict(problemsetId)[submission.username][submission.submissionNumber];
};
