import { Response, Request, NextFunction, Express } from 'express';

module.exports = function(app: Express) {
  app.get('/api/problemset/:problemsetId/scoreboard', (req: Request, res: Response, next: NextFunction) => {
    res.json(false);
  });
};
