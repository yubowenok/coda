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
  illustration?: {
    width: number, // width percentage between [0, 1]
    filename: string,
    text: string, // HTML content with link
  };
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
