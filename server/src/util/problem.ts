import * as paths from '../constants/path';
import * as fs from 'fs';
import { ProblemConfig } from '../constants/problem';

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
