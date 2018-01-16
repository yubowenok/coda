import * as path from 'path';
import * as paths from '../constants/path';
import * as fs from 'fs';
import { ProblemConfig } from '../constants/problem';

export let isValidProblemId = (id: string): boolean => {
  const problemPath = path.join(paths.PROBLEM, id);
  return fs.existsSync(problemPath);
};

export let getProblem = (problemId: string): ProblemConfig => {
  const problemPath = path.join(paths.PROBLEM, problemId);
  if (!isValidProblemId(problemId)) {
    console.error(`problem id "${problemId}" is invalid`);
    return;
  }
  const confFile = path.join(problemPath, paths.CODA_CONF);
  const problemConf: ProblemConfig = JSON.parse(fs.readFileSync(confFile, 'utf8'));
  return problemConf;
};
