export interface SubtaskStats {
  accepted: number;
  attempted: number;
}

export interface SubtaskInfo {
  id: string;
  score: number;
  // stats: SubtaskStats;
}

export interface ProblemInfo {
  number: string;
  id: string;
  title: string;
  isSingleTask: boolean; // filled by server
  subtasks: SubtaskInfo[];
}

export interface ProblemContent {
  title: string;
  statement: string;
  illustration?: {
    width: number, // width percentage between [0, 1]
    filename: string,
    text: string, // HTML content with link
  };
  isSingleTask: boolean; // filled by server
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
