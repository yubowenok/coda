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

export interface ProblemContent {
  title: string;
  statement: string;
  illustration?: {
    width: number, // width percentage between [0, 1]
    filename: string,
    text: string, // HTML content with link
  };
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
}
