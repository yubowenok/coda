export interface ParticipantScore {
  name: string;
  score: number;
  finishTime: number;
  problems: {
    solved: boolean,
    attempts: number
  }[];
}

export interface Scoreboard {
  participants: ParticipantScore[];
}
