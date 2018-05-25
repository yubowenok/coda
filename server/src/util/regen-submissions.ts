import '../config/env';
import * as yargs from 'yargs';
import * as path from 'path';
import * as fs from 'fs';
import * as paths from '../constants/path';
import { Language, Submission } from '../constants/submission';
import { writeSubmissions } from './submit';

const problemsetId = yargs.argv.problemset;

if (!problemsetId) {
  console.error('"--problemset {problemsetId}" required');
  process.exit(1);
}

const languageMap: { [lang: string]: Language } = {
  'C': Language.C,
  'CPP': Language.CPP,
  'JAVA': Language.JAVA
};

const sourceDir = paths.problemsetSourceDir(problemsetId);
const submissions: Submission[] = [];
const usernames = fs.readdirSync(sourceDir).filter(username => username[0] !== '.');
usernames.forEach(username => {
  const userDir = path.join(sourceDir, username);
  const sourceFiles = fs.readdirSync(userDir).filter(file => file[0] !== '.');

  sourceFiles.forEach(filename => {
    const tokens = filename.match(/^(.*)_(\d+)_(\w+)_(\w+)\.(\w+)/);
    const submissionNumber = +tokens[2];
    const problemNumber = tokens[3];
    const subtask = tokens[4];
    const language = languageMap[tokens[5].toUpperCase()];

    const submission: Submission = {
      username,
      problemNumber,
      submissionNumber,
      subtask,
      language,
      problemsetTime: 54000, // Since we lost these, just fill in constants
      submitTime: 'Wed Jan 24 2018 15:00:00 GMT-0500 (EST)',
      sourceFile: filename
    };

    submissions.push(submission);
  });
});

writeSubmissions(problemsetId, submissions);
