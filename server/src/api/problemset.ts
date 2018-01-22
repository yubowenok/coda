import { Response, Request, Express } from 'express';
import { ProblemsetConfig, ProblemsetProblem } from '../constants/problemset';
import {
  getProblemsetDict,
  getProblemsetList,
  getProblem,
  isValidProblemsetId,
  isAuthenticated,
  checkProblemsetStarted
} from '../util';
import {
  WebProblemset
} from '../constants';

/**
 * Creates a web format problemset.
 * Merges problem's subtasks info into the problemset config.
 */
const toWebProblemset = (problemset: ProblemsetConfig): WebProblemset => {
  const result: WebProblemset = {
    id: problemset.id,
    title: problemset.title,
    started: checkProblemsetStarted(problemset),
    runMode: problemset.runMode,
    judgeMode: problemset.judgeMode,
    scoreboardMode: problemset.scoreboardMode,
    penaltyMode: problemset.penaltyMode,
    problems: [],
    startTime: new Date(problemset.startTime).getTime(),
    endTime: new Date(problemset.endTime).getTime()
  };

  if (result.started) {
    result.problems = problemset.problems.map((problemsetProblem: ProblemsetProblem) => {
      const problem = getProblem(problemsetProblem.id);
      return {
        ...problemsetProblem,
        isSingleTask: !problem.subtasks || problem.subtasks.length <= 1,
        title: problem.title
      };
    });
  }

  return result;
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
