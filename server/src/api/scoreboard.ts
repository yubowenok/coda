import { Response, Request, NextFunction, Express } from 'express';
import {
  isValidProblemsetId,
  isAuthenticated,
  getSubmissionDict,
  getProblemset,
  getParticipantScores,
  filterSubmissionDictForBlindJudge,
  checkProblemsetEnded,
  updateObfuscatedBlindJudgments,
  updateTimePenalty
} from '../util';
import {
  ScoreboardMode,
  JudgeMode,
  PenaltyMode,
  SubmissionDict
} from '../constants';

module.exports = function(app: Express) {
  app.get('/api/problemset/:problemsetId/scoreboard',
    isAuthenticated,
    isValidProblemsetId,
    (req: Request, res: Response, next: NextFunction) => {

    const problemsetId = req.params.problemsetId;
    const problemset = getProblemset(problemsetId);
    if (problemset.scoreboardMode === ScoreboardMode.DISABLED) {
      res.status(404).json({ msg: 'scoreboard disabled' });
    }
    let submissionDict: SubmissionDict = getSubmissionDict(problemsetId);
    if (problemset.judgeMode === JudgeMode.BLIND) {
      submissionDict = filterSubmissionDictForBlindJudge(problemset, submissionDict);
    }

    const participants = getParticipantScores(problemset, submissionDict);

    // Obstruct blind judgments.
    if (problemset.judgeMode === JudgeMode.BLIND && !checkProblemsetEnded(problemset)) {
      updateObfuscatedBlindJudgments(participants);
    }

    // Calculate time penalty
    if (problemset.penaltyMode === PenaltyMode.TIME) {
      updateTimePenalty(participants);
    }

    res.json({
      id: problemsetId,
      participants: participants
    });
  });
};
