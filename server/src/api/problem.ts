import { Response, Request, Express } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as paths from '../constants/path';
import {
  getProblemset,
  getProblemsetProblem,
  isValidProblemsetId,
  isValidProblemNumber,
  isAuthenticated,
  parseStatement,
  checkProblemsetStarted,
  isAuthorizedUser
} from '../util';
import { ProblemConfig, ProblemScoring, WebProblem } from '../constants';

/**
 * Creates a web format problem.
 * Merges problemset config (subtask scores, etc.) into problem config.
 */
const toWebProblem = (scoring: ProblemScoring, problem: ProblemConfig): WebProblem => {
  const statement = fs.readFileSync(paths.problemStatementPath(problem.id), 'utf8');
  const webStatement = parseStatement(statement);
  const subtasks = scoring.subtasks.map((subtask: { id: string, score: number }, index: number) => {
    return {
      ...subtask,
      text: webStatement.subtasks[index]
    };
  });
  const samplePath = paths.problemSamplesPath(problem.id);
  const samples = fs.readdirSync(samplePath)
    .filter(filename => {
      return filename[0] !== '.' && filename.match(/.*\.in$/);
    })
    .map(filename => {
      const sample = filename.match(/(.*)\.in$/)[1];
      return {
        id: sample,
        in: fs.readFileSync(path.join(samplePath, `${sample}.in`), 'utf8'),
        out: fs.readFileSync(path.join(samplePath, `${sample}.ans`), 'utf8')
      };
    });

  // Sort samples by id's. They are by default sorted by filename, so "sample-large.in" would incorrectly appear
  // before "sample.in".
  samples.sort((a: { id: string }, b: { id: string }) => {
    if (a === b) {
      return 0;
    }
    return a < b ? -1 : 1;
  });

  return {
    title: problem.title,
    timeLimit: problem.timeLimit,
    illustration: webStatement.illustration,
    isSingleTask: subtasks.length === 1,
    subtasks: subtasks,
    statement: webStatement.statement,
    samples: samples,
    subtaskOnlySamples: problem.subtaskOnlySamples === undefined ? [] : problem.subtaskOnlySamples
  };
};

module.exports = function(app: Express) {
  app.get('/api/problemset/:problemsetId/problem/:problemNumber',
    isAuthenticated,
    isValidProblemsetId,
    isValidProblemNumber,
    isAuthorizedUser,
    (req: Request, res: Response) => {
    const problemsetId = req.params.problemsetId;
    const problemNumber = req.params.problemNumber;
    const problemset = getProblemset(problemsetId);
    const started = checkProblemsetStarted(problemset, req.user.username);

    if (!started && !req.user.isAdmin) {
      return res.status(401).json({ msg: 'Problemset has not started '});
    }

    const problem = getProblemsetProblem(problemset, problemNumber);
    const scoring = problemset.problems.filter(prob => prob.number === problemNumber)[0];
    const webProblem = toWebProblem(scoring, problem);
    if (!started) {
      webProblem.adminView = true;
    }

    res.json(webProblem);
  });

  app.get('/api/image/:problemsetId/:problemNumber/:filename',
    isAuthenticated,
    isValidProblemsetId,
    isValidProblemNumber,
    isAuthorizedUser,
    (req: Request, res: Response) => {
      const problemsetId = req.params.problemsetId;
      const problemNumber = req.params.problemNumber;
      const filename = req.params.filename;

      const problemset = getProblemset(problemsetId);
      const problem = getProblemsetProblem(problemset, problemNumber);
      const filePath = paths.problemImagePath(problem.id, filename);
      if (!filePath) {
        return res.status(404).json({ msg: 'image not found' });
      }
      res.sendFile(filePath);
  });

};
