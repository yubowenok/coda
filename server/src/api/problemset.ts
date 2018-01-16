import { Response, Request, NextFunction, Express } from 'express';
import { isAuthenticated } from '../config/passport';
import { ProblemsetConfig, ProblemsetProblem } from '../constants/problemset';
import { getProblemsetDict, getProblemsetList } from '../util/problemset';
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
      title: problem.title
    };
  });
  return obj;
};

module.exports = function(app: Express) {
  /**
   * Single problemset
   */
  app.get('/api/problemset/:problemsetId', isAuthenticated, (req: Request, res: Response, next: NextFunction) => {
    const problemsetId = req.params.problemsetId;
    const problemsetDict = getProblemsetDict();
    if (!(problemsetId in problemsetDict)) {
      return res.status(500).json({ msg: 'invalid problemset id' });
    }
    res.json(toWebProblemset(problemsetDict[problemsetId]));
  });

  /**
   * Problemset list
   */
  app.get('/api/problemset-list', (req: Request, res: Response, next: NextFunction) => {
    const problemsetList = getProblemsetList().map((problemset: ProblemsetConfig) => {
      return toWebProblemset(problemset);
    });
    res.json(problemsetList);
  });
};
