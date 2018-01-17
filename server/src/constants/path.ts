import * as path from 'path';
import { Submission } from './submission';

const PROBLEMSET_DIR = path.join(process.env.CODA_ROOT, 'problemset');
const PROBLEM_DIR = path.join(process.env.CODA_ROOT, 'problem');

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

export const submissionSourcePath = (problemsetId: string, submission: Submission): string => {
  return path.join(PROBLEMSET_DIR, problemsetId,
    'source', submission.username, submission.source);
};
