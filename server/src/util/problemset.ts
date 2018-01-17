import * as fs from 'fs';
import * as paths from '../constants/path';
import { ProblemsetConfig, ProblemsetDict, JudgeMode } from '../constants';
import { Request, Response, NextFunction } from 'express';

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

const checkProblemsetIntegrity = (problemset: ProblemsetConfig): void => {
  if (problemset.judgeMode === JudgeMode.BLIND && problemset.freebies) {
    console.error(`problemset ${problemset.id} has blind judge but non-zero freebies`);
  }
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
      checkProblemsetIntegrity(problemset);
      return problemset;
    });
};

/**
 *
 * @return One problemset config.
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
  const list: ProblemsetConfig[] = getAllProblemsets();
  list.sort((a: ProblemsetConfig, b: ProblemsetConfig) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });
  return list;
};
