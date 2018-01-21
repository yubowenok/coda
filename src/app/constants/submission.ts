import { Language } from './language';

export enum Verdict {
  PENDING = 'PENDING',
  SKIPPED = 'SKIPPED', // Skipped if not the last submission (blind judge)
  WAITING = 'WAITING', // Waiting to be judged when problemset ends (blind judge)
  AC = 'AC',
  CE = 'CE',
  WA = 'WA',
  TLE = 'TLE',
  RE = 'RE',
  MLE = 'MLE',
  OLE = 'OLE'
}

export const VerdictDisplay: { [verdict: string]: string } = {
  PENDING: 'Pending',
  SKIPPED: 'Skipped',
  WAITING: 'Waiting',
  AC: 'Accepted',
  CE: 'Compile Error',
  WA: 'Wrong Answer',
  RE: 'Run Time Error',
  TLE: 'Time Limit Exceeded',
  MLE: 'Memory Limit Exceeded',
  OLE: 'Output Limit Exceeded'
};

export interface Submission {
  submissionNumber: string; // typically numbered 1, 2, ... for (problemset, username) pair
  problemNumber: string;
  subtask: string;
  verdict: Verdict;
  language: string;
  executionTime: number; // seconds
  // memory: number; // MB
  problemsetTime: number; // seconds into the problemset
  submitTime: number; // date
  outsideProblemsetTime: boolean;
  failedCase?: number; // 0 if AC
  totalCase?: number;
}

export interface SubmissionWithSource extends Submission {
  sourceCode: string;
}

export const ColumnWidth = {
  SUBMISSION_NUMBER: { maxWidth: 40 },
  PROBLEM: {},
  SUBTASK: { maxWidth: 80 },
  SOURCE_CODE: { maxWidth: 20 },
  VERDICT: { maxWidth: 185 },
  LANGUAGE: { maxWidth: 60 },
  EXECUTION_TIME: { maxWidth: 80 },
  PROBLEMSET_TIME: { maxWidth: 90 },
  SUBMIT_TIME: { minWidth: 190, maxWidth: 220 }
};

export interface SubmitData {
  username: string;
  problemsetId: string;
  problemNumber: string;
  subtask: string;
  language: Language;
  sourceCode: string;
}
