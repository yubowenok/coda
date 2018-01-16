import * as fs from 'fs';
import * as path from 'path';
import * as paths from '../constants/path';
import { ProblemsetConfig, ProblemsetDict } from '../constants/problemset';

export const isValidProblemsetId = (id: string): boolean => {
  return fs.existsSync(path.join(paths.PROBLEMSET, id));
};

const getAllProblemsets = (): ProblemsetConfig[] => {
  const problemsets = fs.readdirSync(paths.PROBLEMSET);
  return problemsets
    .filter(filename => filename[0] !== '.') // skip hidden files like .DS_Store
    .map((problemsetId: string) => {
      const confFile = path.join(paths.PROBLEMSET, problemsetId, paths.CODA_CONF);
      const problemset: ProblemsetConfig = JSON.parse(fs.readFileSync(confFile, 'utf8'));
      if (problemset.id !== problemsetId) {
        console.error(`problemset id in config does not match folder name ${problemsetId}`);
      }
      return problemset;
    });
};

/**
 * 
 * @return One problemset config.
 */
export const getProblemset = (problemsetId: string): ProblemsetConfig => {
  if (!isValidProblemsetId(problemsetId)) {
    console.error(`problemset ${problemsetId} does not exist`);
  }
  const problemsetPath = path.join(paths.PROBLEMSET, problemsetId);
  const confFile = path.join(problemsetPath, paths.CODA_CONF);
  return JSON.parse(fs.readFileSync(confFile, 'utf8'));
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
