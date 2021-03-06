import {
  ProblemsetConfig,
  ParticipantScore,
  ProblemsetScoreDict,
  ProblemsetEasierSubtasksDict,
  Submission,
  SubmissionDict,
  User,
  UserDict,
  VerdictType,
  JudgeMode,
  PenaltyMode,
  SECOND_MS
} from '../constants';
import {
  getUserDict,
  getProblemsetScoreDict,
  getSubmissionDict,
  getJudgedSubmission,
  getVerdict,
  checkIgnoredSubmission,
  checkIncorrectSubmission,
  getProblemsetEasierSubtasksDict,
  checkPendingSubmission
} from '../util';

/**
 * Gets the reduced score after the user solves a subtask with ${attempts} attempts (including the AC one).
 * Each incorrect submission reduces score by 10%.
 * User receives a minimum of 30% of the original score.
 */
const getScoreAfterPenalty = (score: number, attempts: number, freebies?: number): number => {
  if (freebies === undefined) {
    freebies = 0;
  }
  const penalty = score * .1;
  const minScore = score * .3;
  const attemptsWithPenalty = Math.max(attempts - 1 - freebies, 0);
  return Math.round(Math.max(minScore, score - penalty * attemptsWithPenalty));
};

/**
 * Calculates time penalty for one participant.
 */
const getTimePenalty = (participant: ParticipantScore): number => {
  let penalty = 0;
  for (const problemNumber in participant.problems) {
    for (const subtask in participant.problems[problemNumber]) {
      const subtaskResult = participant.problems[problemNumber][subtask];
      if (!subtaskResult.solved) {
        continue;
      }
      penalty += 4 * (subtaskResult.attempts - 1);
    }
  }
  return penalty;
};

/**
 * Removes all submissions that do not count for blind judge.
 */
export const filterSubmissionDictForBlindJudge = (dict: SubmissionDict): SubmissionDict => {
  const newDict: SubmissionDict = {};
  for (const username in dict) {
    const filteredSubmissions = dict[username].filter((sub, index) => {
      for (let i = 0; i < index; i++) {
        if (dict[username][i].problemNumber === sub.problemNumber &&
          dict[username][i].subtask === sub.subtask) {
          return false; // discard if a previous submission is made on the same subtask
        }
      }
      return true;
    });
    if (filteredSubmissions.length) {
      newDict[username] = filteredSubmissions;
    }
  }
  return dict;
};

/**
 * Removes testing submission (problemsetTime < 0) so that they don't appear on scoreboard.
 */
export const filterTestPracticeSubmissions = (dict: SubmissionDict): SubmissionDict => {
  const newDict: SubmissionDict = {};
  for (const username in dict) {
    const filteredSubmissions = dict[username]
      .filter(submission => {
        return !submission.outsideProblemsetTime && submission.problemsetTime >= 0;
      });
    if (filteredSubmissions.length) {
      newDict[username] = filteredSubmissions;
    }
  }
  return newDict;
};

/**
 * Removes replay submissions with problemsetTime smaller than the current problemsetTime.
 */
const filterReplaySubmissions = (dict: SubmissionDict, currentTime: number): SubmissionDict => {
  const newDict: SubmissionDict = {};
  for (const username in dict) {
    const filteredSubmissions = dict[username]
      .filter(submission => {
        return submission.problemsetTime < currentTime;
      });
    if (filteredSubmissions.length) {
      newDict[username] = filteredSubmissions;
    }
  }
  return newDict;
};

/**
 * Gets a submission dictionary that contains only effective submissions counted for scoreboard.
 */
export const getEffectiveSubmissionDict = (problemset: ProblemsetConfig): SubmissionDict => {
  let submissionDict: SubmissionDict = filterTestPracticeSubmissions(getSubmissionDict(problemset.id));
  const currentTime = (new Date().getTime() - new Date(problemset.startTime).getTime()) / SECOND_MS;
  submissionDict = filterReplaySubmissions(submissionDict, currentTime);

  if (problemset.judgeMode === JudgeMode.BLIND) {
    submissionDict = filterSubmissionDictForBlindJudge(submissionDict);
  }
  return submissionDict;
};

/**
 * Gets the scores of participants, regardless of problemset runMode.
 */
export const getParticipantScores = (problemset: ProblemsetConfig, submissionDict: SubmissionDict):
  ParticipantScore[] => {
  const participants: ParticipantScore[] = [];

  const users: UserDict = getUserDict();
  const scoreDict: ProblemsetScoreDict = getProblemsetScoreDict(problemset.id);
  const easierSubtasksDict: ProblemsetEasierSubtasksDict = getProblemsetEasierSubtasksDict(problemset.id);

  for (const username in submissionDict) {
    const user: User = users[username];
    // in case we have some discrepancy between submission records and registered users (in dev test)
    const nickname = user ? user.nickname : 'unknown user';

    const participant: ParticipantScore = {
      name: nickname,
      username: username,
      score: 0,
      finishTime: 0,
      problems: {}
    };

    const problems = participant.problems;

    submissionDict[username].forEach((sub: Submission) => {
      const submission = getJudgedSubmission(problemset.id, sub, getVerdict(problemset.id, sub));
      if (!(submission.problemNumber in problems)) {
        problems[submission.problemNumber] = {};
      }
      if (!(submission.subtask in problems[submission.problemNumber])) {
        problems[submission.problemNumber][submission.subtask] = { attempts: 0 };
      }

      const currentSubtaskResult = problems[submission.problemNumber][submission.subtask];
      if (submission.outsideProblemsetTime || // practice solutions do not count
        checkIgnoredSubmission(submission) || // skipped solutions do not count
        currentSubtaskResult.solved) { // ignore submission if the subtask has been solved
        return;
      }

      currentSubtaskResult.attempts++;
      currentSubtaskResult.time = submission.problemsetTime;
      currentSubtaskResult.submissionNumber = submission.submissionNumber;

      const easierSubtasks = easierSubtasksDict[submission.problemNumber][submission.subtask];
      easierSubtasks.forEach(subtask => {
        if (!(subtask in problems[submission.problemNumber])) {
          problems[submission.problemNumber][subtask] = { attempts: 0 };
        }

        const subtaskResult = problems[submission.problemNumber][subtask];
        if (subtaskResult.solved) {
          return; // ignore solved easier subtasks
        }
        // write possible scores
        if (problemset.penaltyMode === PenaltyMode.SCORE) {
          subtaskResult.possibleScore = getScoreAfterPenalty(
            scoreDict[submission.problemNumber][subtask],
            subtaskResult.attempts,
            problemset.freebies
          );
        } else {
          subtaskResult.possibleScore = scoreDict[submission.problemNumber][subtask];
        }
        // write time
        subtaskResult.time = submission.problemsetTime;
      });

      if (submission.verdict === VerdictType.AC) {
        easierSubtasks.forEach(subtask => {
          const subtaskResult = problems[submission.problemNumber][subtask];
          if (subtaskResult.solved) {
            return; // ignore solved easier subtasks
          }
          subtaskResult.score = subtaskResult.possibleScore; // actually obtain the score
          subtaskResult.solved = true;
          subtaskResult.attempts += 1; // add 1 attempt for this harder subtask submission
          subtaskResult.submissionNumber = submission.submissionNumber;

          // total result
          participant.score += subtaskResult.score;
          participant.finishTime = Math.max(participant.finishTime, subtaskResult.time);
        });
      } else if (checkIncorrectSubmission(submission)) {
        currentSubtaskResult.solved = false;
      } else if (checkPendingSubmission(submission)) {
        // nothing
      } else {
        console.error(`unhandled verdict type ${submission.verdict}`);
      }
    });

    participants.push(participant);
  }
  return participants;
};

/**
 * Removes verdicts from scoreboard so that judgements are not shown during blindly judged problemset.
 * Changes are made in place.
 */
export const updateScoreboardForBlindJudge = (participants: ParticipantScore[]): void => {
  participants.forEach(participant => {
    participant.score = 0;
    participant.finishTime = 0;
    for (const problemNumber in participant.problems) {
      for (const subtask in participant.problems[problemNumber]) {
        const subtaskResult = participant.problems[problemNumber][subtask];
        // mark all submissions solved = undefined
        subtaskResult.solved = undefined;
        participant.score += subtaskResult.possibleScore;
        participant.finishTime = Math.max(participant.finishTime, subtaskResult.time);
      }
    }
  });
};

/**
 * Calculates time penalties for the participants.
 * Changes are made in place.
 */
export const updateTimePenalty = (participants: ParticipantScore[]): void => {
  participants.forEach(participant => {
    participant.finishTime += getTimePenalty(participant);
  });
};

/**
 * Anonymizes the scoreboard, except for the login user.
 */
export const anonymizeScoreboard = (participants: ParticipantScore[], username?: string): void => {
  participants.forEach(participant => {
    if (participant.username !== username) {
      participant.username = undefined;
      participant.name = '***';
    }
  });
};
