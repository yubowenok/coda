import * as path from 'path';
import { Language, LanguageSuffix, Submission } from './submission';

const PROBLEMSET_DIR = path.join(process.env.CODA_ROOT, 'problemset');
const PROBLEM_DIR = path.join(process.env.CODA_ROOT, 'problem');

const JUDGE_PROBLEMSET_DIR = path.join(process.env.DOCKER_ROOT, 'problemset');
const JUDGE_PROBLEM_DIR = path.join(process.env.DOCKER_ROOT, 'problem');

export const usersPath = (): string => {
  return path.join(process.env.CODA_ROOT, 'users.json');
};

export const problemsetDir = (problemsetId?: string): string => {
  return problemsetId ? path.join(PROBLEMSET_DIR, problemsetId) : PROBLEMSET_DIR;
};

export const problemsetConfigPath = (problemsetId: string): string => {
  return path.join(PROBLEMSET_DIR, problemsetId, 'coda.conf.json');
};

export const problemsetSubmissionsPath = (problemsetId: string): string => {
  return path.join(PROBLEMSET_DIR, problemsetId, 'submissions.json');
};

export const problemsetAnonymousPath = (problemsetId: string): string => {
  return path.join(PROBLEMSET_DIR, problemsetId, 'anonymous.json');
};

export const problemsetSessionsPath = (problemsetId: string): string => {
  return path.join(PROBLEMSET_DIR, problemsetId, 'sessions.json');
};

export const problemsetSourceDir = (problemsetId: string): string => {
  return path.join(PROBLEMSET_DIR, problemsetId, 'source');
};

export const problemsetVerdictsPath = (problemsetId: string): string => {
  return path.join(PROBLEMSET_DIR, problemsetId, 'verdicts.json');
};

export const problemDir = (problemId?: string): string => {
  return problemId ? path.join(PROBLEM_DIR, problemId) : PROBLEM_DIR;
};

export const problemConfigPath = (problemId: string): string => {
  return path.join(PROBLEM_DIR, problemId, 'coda.conf.json');
};

export const problemStatementPath = (problemId: string): string => {
  return path.join(PROBLEM_DIR, problemId, 'problem_statement/problem.en.tex');
};

export const problemSamplesPath = (problemId: string): string => {
  return path.join(PROBLEM_DIR, problemId, 'data/sample');
};

/**
 * Gives the file name of a submission to save.
 */
export const submissionFileName = (username: string, submissionNumber: number, problemNumber: string, subtask: string,
                                   language: Language): string => {
  return `${username}_${submissionNumber}_${problemNumber}_${subtask}.${LanguageSuffix[language]}`;
};

/**
 * Gives where the submit API shall save the source. sourceName is determined by submissionFileName().
 */
export const submissionSavePath = (problemsetId: string, username: string, sourceName: string): string => {
  return path.join(problemsetSourceDir(problemsetId), username, sourceName);
};

/**
 * Retrieves saved submission path from submission record.
 */
export const submissionSourcePath = (problemsetId: string, submission: Submission): string => {
  return path.join(PROBLEMSET_DIR, problemsetId,
    'source', submission.username, submission.sourceFile);
};

export const judgeProblemPath = (problemId: string): string => {
  return path.join(JUDGE_PROBLEM_DIR, problemId);
};

export const judgeSubmissionSourcePath = (problemsetId: string, submission: Submission): string => {
  return path.join(JUDGE_PROBLEMSET_DIR, problemsetId,
    'source', submission.username, submission.sourceFile);
};

export const runningProblemsetConfigPath = (runningProblemsetConfigId: string): string => {
  return path.join(process.env.CODA_ROOT, `${runningProblemsetConfigId}.json`);
};
