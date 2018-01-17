import { Response, Request, NextFunction, Express } from 'express';
import {
  isValidProblemsetId,
  isAuthenticated
} from '../util';

module.exports = function(app: Express) {
  app.get('/api/problemset/:problemsetId/scoreboard',
    isAuthenticated,
    isValidProblemsetId,
    (req: Request, res: Response, next: NextFunction) => {
    res.json(false);
  });
};
