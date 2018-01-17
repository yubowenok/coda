import * as paths from '../constants/path';
import * as fs from 'fs';
import { ProblemConfig } from '../constants/problem';
import { getProblemset } from './problemset';
import { Request, Response, NextFunction } from 'express';

const checkProblemId = (id: string): boolean => {
  return fs.existsSync(paths.problemDir(id));
};

export const getProblem = (problemId: string): ProblemConfig => {
  if (!checkProblemId(problemId)) {
    console.error(`problem id "${problemId}" is invalid`);
    return;
  }
  const confFile = paths.problemConfigPath(problemId);
  const problemConf: ProblemConfig = JSON.parse(fs.readFileSync(confFile, 'utf8'));
  return problemConf;
};

/*** Router middleware utils ***/

/**
 * Checks if the problemset has a problemNumber, assuming problemsetId is valid.
 */
export const isValidProblemNumber = (req: Request, res: Response, next: NextFunction) => {
  const problemsetId = req.params.problemsetId;
  const problemNumber = req.params.problemNumber;
  const problemset = getProblemset(problemsetId);
  if (problemset.problems.map(problem => problem.number).indexOf(problemNumber) === -1) {
    res.status(404).json({ msg: 'invalid problem number' });
  }
  next();
};
