import * as fs from 'fs';
import * as paths from '../constants/path';
import {
  Submission,
  SubmissionDict,
  Verdict,
  VerdictType,
  VerdictDict,
  JudgedSubmission,
  JudgedSubmissionWithSource,
  BlindJudgeStatus,
  ProblemsetConfig,
  JudgeMode
} from '../constants';
import { checkProblemsetEnded } from './problemset';

/**
 * Reads submission.json and gets all submissions for a problemset;
 */
const getSubmissions = (problemsetId: string): Submission[] => {
  const submissionsPath = paths.problemsetSubmissionsPath(problemsetId);
  const json = (fs.existsSync(submissionsPath) && fs.readFileSync(submissionsPath, 'utf8')) || '';
  return json === '' ? [] : JSON.parse(json);
};

/**
 * Reads verdicts.json and gets all verdicts for a problemset.
 */
const getVerdicts = (problemsetId: string): Verdict[] => {
  const verdictsPath = paths.problemsetVerdictsPath(problemsetId);
  const json = fs.existsSync(verdictsPath) && fs.readFileSync(verdictsPath, 'utf8');
  return json === '' ? [] : JSON.parse(json);
};

const submissionSorter = (a: Submission, b: Submission): number => {
  if (a.problemsetTime === b.problemsetTime) {
    if (a.username === b.username) {
      return a.submissionNumber - b.submissionNumber;
    }
    return a.username < b.username ? -1 : (a.username > b.username ? 1 : 0);
  }
  return a.problemsetTime - b.problemsetTime;
};

/**
 * @returns List of submissions (for the username) inside a problemset, sorted by submission order.
 */
export const getSubmissionList = (problemsetId: string, username?: string): Submission[] => {
  let submissions = getSubmissions(problemsetId);
  if (username) {
    submissions = submissions.filter(submission => submission.username === username);
  }
  submissions.sort(submissionSorter);
  return submissions;
};

/**
 * @returns A dictionary mapping username to her submissions.
 */
export const getSubmissionDict = (problemsetId: string): SubmissionDict => {
  const submissions = getSubmissions(problemsetId);
  if (!submissions.length) {
    return {};
  }
  const dict: SubmissionDict = {};
  submissions.forEach((submission: Submission) => {
    if (!(submission.username in dict)) {
      dict[submission.username] = [];
    }
    dict[submission.username].push(submission);
  });
  for (const username in dict) {
    dict[username].sort(submissionSorter);
  }
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
  const verdicts = getVerdicts(problemsetId);
  if (!verdicts.length) {
    return {};
  }
  const dict: VerdictDict = {};
  verdicts.forEach(verdict => {
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

/**
 * Creates a judged submission record, filling in verdict info.
 */
export const getJudgedSubmission = (submission: Submission, verdict: Verdict | undefined): JudgedSubmission => {
  if (!verdict) {
    verdict = {
      username: submission.username,
      submissionNumber: submission.submissionNumber,
      failedCase: 0,
      totalCase: 0,
      verdict: VerdictType.PENDING,
      executionTime: 0,
      sourceFile: submission.sourceFile
      // memory: 0
    };
  }
  return {
    // from submission record
    submissionNumber: submission.submissionNumber,
    problemNumber: submission.problemNumber,
    subtask: submission.subtask,
    language: submission.language,
    submitTime: new Date(submission.submitTime).getTime(),
    problemsetTime: submission.problemsetTime,
    outsideProblemsetTime: submission.outsideProblemsetTime,
    // from verdict
    verdict: verdict.verdict,
    executionTime: verdict.executionTime,
    // memory: verdict.memory
    blindJudgeStatus: submission.blindJudgeStatus
  };
};

/**
 * Adds source code to a judged submission record.
 */
export const getJudgedSubmissionWithSource = (problemsetId: string, submission: Submission,
                                       verdict: Verdict | undefined): JudgedSubmissionWithSource => {
  return {
    ...getJudgedSubmission(submission, verdict),
    sourceCode: fs.readFileSync(paths.submissionSourcePath(problemsetId, submission), 'utf8')
  };
};

export const checkIncorrectSubmission = (submission: JudgedSubmission): boolean => {
  return submission.verdict !== VerdictType.AC &&
    submission.verdict !== VerdictType.PENDING &&
    submission.verdict !== VerdictType.SKIPPED &&
    submission.verdict !== VerdictType.CE;
};

export const checkIgnoredSubmission = (submission: JudgedSubmission): boolean => {
  return submission.verdict === VerdictType.SKIPPED;
};

export const checkPendingSubmission = (submission: JudgedSubmission): boolean => {
  return submission.verdict === VerdictType.PENDING;
};

export const updateVerdictForBlindJudge = (problemset: ProblemsetConfig, submission: JudgedSubmission): void => {
  if (problemset.judgeMode !== JudgeMode.BLIND || !submission.blindJudgeStatus) {
    return;
  }

  if (submission.blindJudgeStatus === BlindJudgeStatus.SKIPPED) {
    submission.verdict = VerdictType.SKIPPED;
  } else if (submission.blindJudgeStatus === BlindJudgeStatus.FINAL && !checkProblemsetEnded(problemset)) {
    submission.verdict = VerdictType.WAITING;
  }
};

export const updateVerdictsForBlindJudge = (problemset: ProblemsetConfig, submissions: JudgedSubmission[]): void => {
  if (problemset.judgeMode !== JudgeMode.BLIND) {
    return;
  }
  submissions.forEach(submission => updateVerdictForBlindJudge(problemset, submission));
};
