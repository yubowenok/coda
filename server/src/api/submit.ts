import { Response, Request, NextFunction, Express } from 'express';

module.exports = function(app: Express) {
  app.post('/api/problemset/:problemsetId/submit', (req: Request, res: Response, next: NextFunction) => {

    res.json(false);
  });
};
