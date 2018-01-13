export interface ParticipantScore {
  name: string;
  score: number;
  finishTime: number;
  problems: {
    [problemNumber: string]: {
      [subtaskId: string]: {
        attempts: number,
        solved?: boolean, // boolean for standard mode, undefined for selftest before ending
        score?: number,
        time?: number, // solved time, seconds from start
        submissionId?: string // if solved, this is the first AC submission id
      }
    }
  };
}

export interface Scoreboard {
  id: string; // problemset id
  participants: ParticipantScore[];
}
