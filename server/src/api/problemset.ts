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
import { isAuthorizedUser } from '../util/users';

/**
 * Creates a web format problemset.
 * Merges problem's subtasks info into the problemset config.
 */
const toWebProblemset = (problemset: ProblemsetConfig): WebProblemset => {
  return {
    id: problemset.id,
    title: problemset.title,
    started: checkProblemsetStarted(problemset),
    runMode: problemset.runMode,
    judgeMode: problemset.judgeMode,
    scoreboardMode: problemset.scoreboardMode,
    penaltyMode: problemset.penaltyMode,
    startTime: new Date(problemset.startTime).getTime(),
    endTime: new Date(problemset.endTime).getTime(),
    problems: problemset.problems.map((problemsetProblem: ProblemsetProblem) => {
      const problem = getProblem(problemsetProblem.id);
      return {
        ...problemsetProblem,
        isSingleTask: !problem.subtasks || problem.subtasks.length <= 1,
        title: problem.title
      };
    })
  };
};

module.exports = function(app: Express) {
  /**
   * Single problemset
   */
  app.get('/api/problemset/:problemsetId',
    isAuthenticated,
    isValidProblemsetId,
    isAuthorizedUser,
    (req: Request, res: Response) => {
    const problemsetId = req.params.problemsetId;
    const problemsetDict = getProblemsetDict();
    const webProblemset = toWebProblemset(problemsetDict[problemsetId]);

    if (!webProblemset.started) {
      if (req.user.isAdmin) {
        webProblemset.adminView = true;
      } else {
        webProblemset.problems = []; // hide from web
      }
    }
    res.json(webProblemset);
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
