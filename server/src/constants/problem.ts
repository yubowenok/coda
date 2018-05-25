import { WebIllustration } from './parse-tex';

export interface ProblemConfig {
  id: string;
  title: string;
  timeLimit: number; // # seconds
  subtasks: string[]; // subtask id's
  subtaskOnlySamples: {
    sample: string,
    subtasks: string[] // the sample only applies to these subtasks
  }[];
  vjudge?: {
    oj: string,
    probNum: string
  } | false;
}

export interface WebProblem {
  title: string;
  timeLimit: number;
  statement: string;
  illustration?: WebIllustration;
  isSingleTask: boolean;
  subtasks: {
    id: string,
    score: number,
    text: string // subtask constraint text
  }[];
  samples: {
    id: string,
    in: string,
    out: string
  }[];
  subtaskOnlySamples: {
    sample: string,
    subtasks: string[]
  }[];
  adminView?: boolean;
}

export interface ProblemEasierSubtasksDict {
  [subtask: string]: string[]; // subtask easier than this one (including itself)
}
