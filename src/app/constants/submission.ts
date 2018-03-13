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

  // seconds into the problemset
  // if negative, then it is testing before the problemset starts
  problemsetTime: number;

  submitTime: number; // date
  outsideProblemsetTime: boolean;
  failedCase?: number; // 0 if AC
  failedCaseName?: string; // '' or undefined if unkonwn
  totalCase?: number;
}

export interface SubmissionWithSource extends Submission {
  sourceCode: string;
  compileError?: string;
  adminView?: boolean;
}

export interface SubmitData {
  username: string;
  problemsetId: string;
  problemNumber: string;
  subtask: string;
  language: Language;
  sourceCode: string;
}
