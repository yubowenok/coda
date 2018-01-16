import { Response, Request, NextFunction, Express } from 'express';

module.exports = function(app: Express) {
  /**
   * Single submission
   */
  app.get('/api/problemset/:problemsetId/submission/:username/:submissionId', (req: Request, res: Response,
                                                                               next: NextFunction) => {
    res.json(false);
  });

  /**
   * Submission list for one user
   */
  app.get('/api/problemset/:problemsetId/submissions/:username', (req: Request, res: Response,
                                                                               next: NextFunction) => {
    res.json(false);
  });
};
