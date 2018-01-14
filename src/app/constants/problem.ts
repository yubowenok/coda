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
  subtasks: SubtaskInfo[];
}

export interface ProblemContent {
  title: string;
  statement: string;
  illustration?: {
    href: string,
    hrefText: string, // description of href
    url: string,
    width: number // width percentage between [0, 1]
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
