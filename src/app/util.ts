import { FormControl, ValidationErrors } from '@angular/forms';
import { ProblemsetInfo, Submission, Verdict } from './constants';

export const passwordLengthValidator = (passwordControl: FormControl): ValidationErrors | null => {
  return passwordControl.value.length < 6 ? { length: true } : null;
};

export const passwordMatchValidator = (confirmPasswordControl: FormControl): ValidationErrors | null => {
  if (confirmPasswordControl.parent == null) {
    return null;
  }
  const passwordControl = confirmPasswordControl.parent.controls['password'];
  return passwordControl.value !== confirmPasswordControl.value ? { mismatch: true } : null;
};

export const usernameCharactersValidator = (usernameControl: FormControl): ValidationErrors | null => {
  return !usernameControl.value.match(/^[a-z][a-z0-9_]*/) ? { characters: true } : null;
};

export const usernameLengthValidator = (usernameControl: FormControl): ValidationErrors | null => {
  return usernameControl.value.length < 3 ? { length: true } : null;
};

export const problemsetEnded = (problemset: ProblemsetInfo): boolean => {
  return problemset.endTime <= new Date().getTime();
};

export const executionTimeDisplay = (submission: Submission): string => {
  if (submission.verdict === Verdict.PENDING ||
    submission.verdict === Verdict.SKIPPED ||
    submission.verdict === Verdict.WAITING ||
    submission.verdict === Verdict.CE) {
    return '-';
  }
  return `${submission.verdict === Verdict.TLE ? '> ' : ''}${submission.executionTime}s`;
};

export const problemsetTimeDisplay = (submission: Submission): number | string => {
  return submission.outsideProblemsetTime ? '' : submission.problemsetTime;
};

export const shouldProblemsetDisplay = (problemset: ProblemsetInfo): boolean => {
  return problemset.started || problemset.adminView;
};
