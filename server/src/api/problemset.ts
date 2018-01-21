import { Response, Request, Express } from 'express';
import { ProblemsetConfig, ProblemsetProblem } from '../constants/problemset';
import {
  getProblemsetDict,
  getProblemsetList,
  isValidProblemsetId,
  isAuthenticated
} from '../util';
import { getProblem } from '../util/problem';

/**
 * Creates a web format problemset.
 * Merges problem's subtasks info into the problemset config.
 */
const toWebProblemset = (problemset: ProblemsetConfig): Object => {
  const startTime = new Date(problemset.startTime).getTime();
  const obj = {
    ...problemset,
    startTime: startTime,
    endTime: new Date(problemset.endTime).getTime(),
    started: startTime < new Date().getTime()
  };

  obj.problems = obj.problems.map((problemsetProblem: ProblemsetProblem) => {
    const problem = getProblem(problemsetProblem.id);
    return {
      ...problemsetProblem,
      isSingleTask: !problem.subtasks || problem.subtasks.length <= 1,
      title: problem.title
    };
  });
  return obj;
};

module.exports = function(app: Express) {
  /**
   * Single problemset
   */
  app.get('/api/problemset/:problemsetId',
    isAuthenticated,
    isValidProblemsetId,
    (req: Request, res: Response) => {
    const problemsetId = req.params.problemsetId;
    const problemsetDict = getProblemsetDict();
    res.json(toWebProblemset(problemsetDict[problemsetId]));
  });

  /**
   * Problemset list
   */
  app.get('/api/problemsets', (req: Request, res: Response) => {
    const problemsetList = getProblemsetList().map((problemset: ProblemsetConfig) => {
      return toWebProblemset(problemset);
    });
    res.json(problemsetList);
  });
};
