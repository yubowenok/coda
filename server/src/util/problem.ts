import * as paths from '../constants/path';
import * as fs from 'fs';
import { ProblemConfig, ProblemEasierSubtasksDict } from '../constants/problem';
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

/**
 * Creates a dictionary that maps each subtask id to its easier subtask id's (including itself).
 */
export const getProblemEasierSubtasksDict = (problemId: string): ProblemEasierSubtasksDict => {
  const problem = getProblem(problemId);
  const dict: ProblemEasierSubtasksDict = {};
  for (let i = 0; i < problem.subtasks.length; i++) {
    dict[problem.subtasks[i]] = [];
    for (let j = 0; j <= i; j++) {
      dict[problem.subtasks[i]].push(problem.subtasks[j]);
    }
  }
  return dict;
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
