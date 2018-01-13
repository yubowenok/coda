export enum Verdict {
  PENDING = 'PENDING',
  SKIPPED = 'SKIPPED',
  AC = 'AC',
  CE = 'CE',
  WA = 'WA',
  TLE = 'TLE',
  OLE = 'OLE'
}

export const VerdictDisplay: { [verdict: string]: string } = {
  PENDING: 'Pending',
  SKIPPED: 'Skipped',
  AC: 'Accepted',
  CE: 'Compile Error',
  WA: 'Wrong Answer',
  TLE: 'Time Limit Exceeded',
  OLE: 'Output Limit Exceeded'
};

export interface Submission {
  id: string; // submission id, typically numbered 1, 2, ... for (problemset, username) pair
  problemNumber: string;
  subtask?: string;
  verdict: Verdict;
  language: string;
  submitTime: number;
  problemsetTime: number; // seconds into the problemset
  outsideProblemsetTime: boolean;
}

export interface SubmissionWithSource extends Submission {
  source: string;
}
