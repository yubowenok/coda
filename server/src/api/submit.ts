import { Response, Request, NextFunction, Express } from 'express';

module.exports = function(app: Express) {
  app.post('/api/problemset/:problemsetId/submit', (req: Request, res: Response, next: NextFunction) => {
    // TODO: calculate submissionNumber
    // TODO: calculate outsideProblemsetTime
    // TODO: mark skipped submissions for blind judge
    res.json(false);
  });
};
