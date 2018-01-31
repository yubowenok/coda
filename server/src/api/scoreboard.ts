import { Response, Request, Express } from 'express';
import {
  isValidProblemsetId,
  isAuthenticated,
  getSubmissionDict,
  getProblemset,
  getParticipantScores,
  filterSubmissionDictForBlindJudge,
  filterTestPracticeSubmissions,
  checkProblemsetEnded,
  updateScoreboardForBlindJudge,
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
    (req: Request, res: Response) => {

    const problemsetId = req.params.problemsetId;
    const problemset = getProblemset(problemsetId);
    if (problemset.scoreboardMode === ScoreboardMode.DISABLED) {
      return res.status(404).json({ msg: 'scoreboard disabled' });
    }
    let submissionDict: SubmissionDict = filterTestPracticeSubmissions(getSubmissionDict(problemsetId));
    if (problemset.judgeMode === JudgeMode.BLIND) {
      submissionDict = filterSubmissionDictForBlindJudge(submissionDict);
    }

    const participants = getParticipantScores(problemset, submissionDict);

    // Obstruct blind judgments.
    if (problemset.judgeMode === JudgeMode.BLIND && !checkProblemsetEnded(problemset)) {
      updateScoreboardForBlindJudge(participants);
    }

    // Calculate time penalty
    if (problemset.penaltyMode === PenaltyMode.TIME) {
      updateTimePenalty(participants);
    }

    // TODO(anonymous)
    // updateAnonymousScoreboard(participants);

    res.json({
      id: problemsetId,
      participants: participants
    });
  });
};
