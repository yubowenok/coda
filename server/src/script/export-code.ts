/**
 * Exports the submissions for a problemset.
 *
 * Usage:
 *   node export-code.js --problemset {problemsetId} [--output {outputDir}]
 */
import '../config/env';
import * as yargs from 'yargs';
import * as path from 'path';
import * as paths from '../constants/path';
import * as fs from 'fs';

import {
  getProblemset,
  getEffectiveSubmissionDict,
  getParticipantScores
} from '../util';
import {
  Submission
} from '../constants';

/** Contains only the last submission of each username per subtask */
const LAST_DIR = 'last';
/** Contains all submissions of a username */
const ALL_DIR = 'all';

const problemsetId = yargs.argv.problemset;
if (!problemsetId) {
  console.error('require arg "problemset"');
  process.exit(1);
}

const output = yargs.argv.output || `${problemsetId}-source`;
if (fs.existsSync(output)) {
  console.error(`output folder "${output}" is not empty`);
  process.exit(1);
}
fs.mkdirSync(output);

const lastDir = path.join(output, LAST_DIR);
const allDir = path.join(output, ALL_DIR);
fs.mkdirSync(lastDir);
fs.mkdirSync(allDir);

const problemset = getProblemset(problemsetId);
const submissionDict = getEffectiveSubmissionDict(problemset);
const participants = getParticipantScores(problemset, submissionDict);

/** Each username's last counted submission numbers */
const lastSubmissionDict: { [username: string]: number[] } = {};

participants.forEach(participant => {
  const username = participant.username;
  for (const problemNumber in participant.problems) {
    for (const subtask in participant.problems[problemNumber]) {
      const submissionNumber = participant.problems[problemNumber][subtask].submissionNumber;
      if (!(username in lastSubmissionDict)) {
        lastSubmissionDict[username] = [];
      }
      lastSubmissionDict[username].push(submissionNumber);
    }
  }
});

for (const username in submissionDict) {
  fs.mkdirSync(path.join(lastDir, username));
  fs.mkdirSync(path.join(allDir, username));

  const lastSubmissions = lastSubmissionDict[username];
  const submissions = submissionDict[username];
  submissions.forEach((submission: Submission) => {
    const sourcePath = paths.submissionSourcePath(problemsetId, submission);

    const copyLastDest = path.join(lastDir, username, submission.sourceFile);
    const copyAllDest = path.join(allDir, username, submission.sourceFile);

    fs.copyFileSync(sourcePath, copyAllDest);
    if (lastSubmissions.indexOf(submission.submissionNumber) !== -1) {
      fs.copyFileSync(sourcePath, copyLastDest);
    }
  });
}
