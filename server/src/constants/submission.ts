export enum Language {
  C = 'C',
  CPP = 'CPP',
  JAVA = 'JAVA'
}

export interface Submission {
  username: string;
  submissionNumber: number; // # of this user's submission within the problemset; not a primary key of submission
  problemNumber: string;
  language: Language;
  subtask: string;
  sourceFile: string; // path to source file
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
  sourceFile: string; // path to source file
  verdict: VerdictType;
  executionTime: number;
  memory: number;
  failedCase: number;
  totalCase: number;
}

export interface VerdictDict {
  [username: string]: { [submissionNumber: number]: Verdict };
}

export interface JudgedSubmission {
  submissionNumber: number; // typically numbered 1, 2, ... for (problemset, username) pair
  problemNumber: string;
  subtask: string;
  verdict: VerdictType;
  language: string;
  executionTime: number; // seconds
  memory: number; // MB
  problemsetTime: number; // seconds into the problemset
  submitTime: number; // date
  outsideProblemsetTime: boolean;
  failedCase?: number; // 0 if AC
  totalCase?: number;
}

export interface JudgedSubmissionWithSource extends JudgedSubmission {
  sourceCode: string;
}
