export interface ParticipantScore {
  name: string;
  username: string;
  score: number;
  finishTime: number;
  problems: {
    [problemNumber: string]: {
      [subtaskId: string]: {
        attempts: number,
        score?: number,
        // score one could earn in blind mode if the last submission is correct
        possibleScore?: number,
        // boolean for standard mode, undefined for selftest before ending
        solved?: boolean,
        // solved time, seconds from start
        time?: number,
        // if solved, this is the first AC submission number, used for creating links on scoreboard
        submissionNumber?: number
      }
    }
  };
}

export interface Scoreboard {
  id: string; // problemset id
  participants: ParticipantScore[];
}
