import { ProblemInfo } from './problem';

export enum RunMode {
  STANDARD = 'STANDARD',
  SELFTEST = 'SELFTEST'
}

export enum JudgeMode {
  OPEN = 'OPEN',
  BLIND = 'BLIND'
}

export enum PenaltyMode {
  SCORE = 'SCORE',
  TIME = 'TIME'
}

export enum ScoreboardMode {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
  ANONYMOUS = 'ANONYMOUS'
}

export interface ProblemsetInfo {
  id: string;
  title: string;
  runMode: RunMode;
  judgeMode: JudgeMode;
  penaltyMode: PenaltyMode;
  scoreboardMode: ScoreboardMode;
  startTime: number;
  endTime: number;
  duration?: number; // selftest
  freebies: number;
  showCaseNumber: boolean;
  problems: ProblemInfo[];
}
