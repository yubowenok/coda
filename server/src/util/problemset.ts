import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as paths from '../constants/path';
import {
  ProblemsetConfig,
  ProblemsetDict,
  ProblemsetScoreDict,
  ProblemsetEasierSubtasksDict,
  RunMode
} from '../constants';
import { getProblemEasierSubtasksDict } from './problem';

const checkProblemsetId = (id: string): boolean => {
  return fs.existsSync(paths.problemsetDir(id));
};

export const isValidProblemsetId = (req: Request, res: Response, next: NextFunction) => {
  const problemsetId = req.params.problemsetId;
  if (!checkProblemsetId(problemsetId)) {
    return res.status(404).json({ msg: 'invalid problemset id' });
  }
  next();
};

const getAllProblemsets = (): ProblemsetConfig[] => {
  const problemsets = fs.readdirSync(paths.problemsetDir());
  return problemsets
    .filter(filename => filename[0] !== '.') // skip hidden files like .DS_Store
    .map((problemsetId: string) => {
      const problemset: ProblemsetConfig = JSON.parse(
        fs.readFileSync(paths.problemsetConfigPath(problemsetId), 'utf8'));
      if (problemset.id !== problemsetId) {
        console.error(`problemset id in config does not match folder name ${problemsetId}`);
      }
      return problemset;
    });
};

/**
 * @returns One problemset config.
 */
export const getProblemset = (problemsetId: string): ProblemsetConfig => {
  if (!checkProblemsetId(problemsetId)) {
    console.error(`problemset ${problemsetId} does not exist`);
  }
  return JSON.parse(fs.readFileSync(paths.problemsetConfigPath(problemsetId), 'utf8'));
};

/**
 * @returns A dictionary mapping problemsetId to ProblemsetConfig.
 */
export const getProblemsetDict = (): ProblemsetDict => {
  const dict: ProblemsetDict = {};
  getAllProblemsets().forEach(problemset => {
    dict[problemset.id] = problemset;
  });
  return dict;
};

/**
 * @returns A list of problemset configurations, sorted by startTime.
 */
export const getProblemsetList = (): ProblemsetConfig[] => {
  const list: ProblemsetConfig[] = getAllProblemsets()
    .filter(problemset => !problemset.private);
  list.sort((a: ProblemsetConfig, b: ProblemsetConfig) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });
  return list;
};

/**
 * @returns Number of seconds since problemset starts till now.
 */
export const getProblemsetTime = (problemset: ProblemsetConfig): number => {
  // TODO: this does not handle user session in Selftest!
  return Math.floor((new Date().getTime() - new Date(problemset.startTime).getTime()) / 1000);
};

export const getProblemsetScoreDict = (problemsetId: string): ProblemsetScoreDict => {
  const problemset = getProblemset(problemsetId);
  const dict: ProblemsetScoreDict = {};
  problemset.problems.forEach(problem => {
    if (!(problem.number in dict)) {
      dict[problem.number] = {};
    }
    problem.subtasks.forEach(subtask => {
      dict[problem.number][subtask.id] = subtask.score;
    });
  });
  return dict;
};

export const checkProblemsetStarted = (problemset: ProblemsetConfig): boolean => {
  if (problemset.runMode === RunMode.STANDARD) {
    return new Date(problemset.startTime).getTime() <= new Date().getTime();
  } else if (problemset.runMode === RunMode.SELFTEST) {
    console.error('isProblemsetStarted not implemented for SELFTEST');
    return false;
  }
};

export const checkProblemsetEnded = (problemset: ProblemsetConfig): boolean => {
  if (problemset.runMode === RunMode.STANDARD) {
    return new Date(problemset.endTime).getTime() <= new Date().getTime();
  } else if (problemset.runMode === RunMode.SELFTEST) {
    console.error('isProblemsetEnded not implemented for SELFTEST');
    return false;
  }
};

/**
 * Creates a dictionary that maps problemNumber to ProblemEasierSubtasksDict.
 */
export const getProblemsetEasierSubtasksDict = (problemId: string): ProblemsetEasierSubtasksDict => {
  const problemset = getProblemset(problemId);
  const dict: ProblemsetEasierSubtasksDict = {};
  for (let i = 0; i < problemset.problems.length; i++) {
    const problem = problemset.problems[i];
    dict[problem.number] = getProblemEasierSubtasksDict(problem.id);
  }
  return dict;
};
