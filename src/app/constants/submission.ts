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
  id: string; // submission id, typically numbered 1, 2, ... for (problemset, username) pair
  problemNumber: string;
  subtask?: string;
  verdict: Verdict;
  language: string;
  executionTime: number; // seconds
  submitTime: number;
  problemsetTime: number; // seconds into the problemset
  outsideProblemsetTime: boolean;
  failedCase: number; // 0 if AC
  totalCase: number;
  memory: number; // MB
}

export interface SubmissionWithSource extends Submission {
  source: string;
}
