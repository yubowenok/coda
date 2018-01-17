import { Response, Request, NextFunction, Express } from 'express';
import { getProblemset, getProblem, isValidProblemsetId } from '../util';
import { ProblemsetConfig, ProblemConfig } from '../constants';
import { ProblemsetProblem } from '../constants/problemset';
import { isAuthenticated } from '../config/passport';
import * as path from 'path';
import * as paths from '../constants/path';
import * as fs from 'fs';

/**
 * Creates a web format problem.
 * Merges problemset config (subtask scores, etc.) into problem config.
 */
const toWebProblem = (problemsetProblem: ProblemsetProblem, problem: ProblemConfig): Object => {
  const statement = fs.readFileSync(paths.problemStatementPath(problem.id), 'utf8');

  const subtasks = problemsetProblem.subtasks.map((subtask: { id: string, score: number }) => {
    return {
      ...subtask,
      text: '(placeholder)'
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
    illustration: undefined, // {width, filename, text}
    isSingleTask: subtasks.length === 1,
    subtasks: subtasks,
    statement: statement,
    samples: samples,
    subtaskOnlySamples: problem.subtaskOnlySamples === undefined ? [] : problem.subtaskOnlySamples
  };
};

module.exports = function(app: Express) {
  app.get('/api/problemset/:problemsetId/problem/:problemNumber',
    isAuthenticated,
    isValidProblemsetId,
    (req: Request, res: Response, next: NextFunction) => {
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
