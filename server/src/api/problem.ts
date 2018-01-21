import { Response, Request, Express } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as paths from '../constants/path';
import {
  getProblemset,
  getProblem,
  isValidProblemsetId,
  isValidProblemNumber,
  isAuthenticated,
  parseStatement
} from '../util';
import { ProblemConfig, ProblemsetProblem } from '../constants';

/**
 * Creates a web format problem.
 * Merges problemset config (subtask scores, etc.) into problem config.
 */
const toWebProblem = (problemsetProblem: ProblemsetProblem, problem: ProblemConfig): Object => {
  const statement = fs.readFileSync(paths.problemStatementPath(problem.id), 'utf8');
  const webStatement = parseStatement(statement);
  const subtasks = problemsetProblem.subtasks.map((subtask: { id: string, score: number }, index: number) => {
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
    (req: Request, res: Response) => {
    const problemsetId = req.params.problemsetId;
    const problemNumber = req.params.problemNumber;
    const problemset = getProblemset(problemsetId);
    let found = false;
    problemset.problems.forEach((prob: ProblemsetProblem) => {
      if (prob.number === problemNumber) {
        res.json(toWebProblem(prob, getProblem(prob.id)));
        found = true;
      }
    });
    if (!found) {
      res.status(500).json({ msg: 'critical server error' });
    }
  });
};