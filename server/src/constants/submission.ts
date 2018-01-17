export interface Submission {
  username: string;
  submissionNumber: number; // # of this user's submission within the problemset; not a primary key of submission
  problemNumber: string;
  language: string;
  subtask: string;
  source: string; // path to source file
  problemsetTime: number; // # seconds since problemset / selftest session starts
  submitTime: string; // date string
  outsideProblemsetTime?: boolean;
}

export interface SubmissionDict {
  [username: string]: Submission[];
}

export enum VerdictType {
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

export interface Verdict {
  username: string;
  submissionNumber: number;
  source: string; // path to source file
  verdict: VerdictType;
  executionTime: number;
  memory: number;
  failedCase: number;
  totalCase: number;
}

export interface VerdictDict {
  [username: string]: { [submissionNumber: number]: Verdict };
}
