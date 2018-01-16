import { Response, Request, NextFunction, Express } from 'express';

module.exports = function(app: Express) {
  app.get('/api/problemset/:problemsetId/problem/:problemNumber', (req: Request, res: Response, next: NextFunction) => {
    res.json(false);
  });
};
