import { ProblemEasierSubtasksDict } from './problem';

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

export interface ProblemsetProblem {
  number: string;
  id: string;
  subtasks: { id: string, score: number }[];
}

export interface ProblemsetConfig {
  id: string;
  title: string;
  runMode: RunMode;
  judgeMode: JudgeMode;
  penaltyMode: PenaltyMode;
  scoreboardMode: ScoreboardMode;
  startTime: string;
  endTime: string;
  duration?: number;
  freebies?: number;
  showCaseNumber?: boolean;
  problems: ProblemsetProblem[];
  allowUsers: string[];
  allowGroups: string[];
  fullFeedback?: boolean;
  private?: boolean;
}

export interface ProblemsetDict {
  [problemsetId: string]: ProblemsetConfig;
}

export interface ProblemsetScoreDict {
  [problemNumber: string]: {
    [subtask: string]: number // score for each subtask
  };
}

export interface ProblemsetEasierSubtasksDict {
  [problemNumber: string]: ProblemEasierSubtasksDict;
}

export interface WebProblemset {
  id: string;
  title: string;
  started: boolean;
  runMode: RunMode;
  judgeMode: JudgeMode;
  penaltyMode: PenaltyMode;
  scoreboardMode: ScoreboardMode;
  problems: ProblemsetProblem[];
  startTime: number;
  endTime: number;
  adminView?: boolean;
}
