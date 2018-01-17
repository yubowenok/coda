export enum Verdict {
  PENDING = 'PENDING',
  SKIPPED = 'SKIPPED',
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
  subtask?: string;
  verdict: Verdict;
  language: string;
  executionTime: number; // seconds
  memory: number; // MB
  problemsetTime: number; // seconds into the problemset
  submitTime: number; // date
  outsideProblemsetTime: boolean;
  failedCase?: number; // 0 if AC
  totalCase?: number;
}

export interface SubmissionWithSource extends Submission {
  source: string;
}
