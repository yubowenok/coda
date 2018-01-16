import { Response, Request, NextFunction, Express } from 'express';

module.exports = function(app: Express) {
  /**
   * Single problemset
   */
  app.get('/api/problemset/:problemsetId', (req: Request, res: Response, next: NextFunction) => {
    res.json(false);
  });

  /**
   * Problemset list
   */
  app.get('/api/problemset-list', (req: Request, res: Response, next: NextFunction) => {
    res.json(false);
  });
};
