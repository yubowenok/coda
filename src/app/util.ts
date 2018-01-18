import { FormControl, ValidationErrors } from '@angular/forms';
import { ProblemsetInfo } from './constants/problemset';

export const passwordLengthValidator = (passwordControl: FormControl): ValidationErrors | null => {
  if (passwordControl.value.length < 6) {
    return {
      error: { tooShort: true }
    };
  }
  return null;
};

export const passwordMatchValidator = (confirmPasswordControl: FormControl): ValidationErrors | null => {
  if (confirmPasswordControl.parent == null) {
    return null;
  }
  const passwordControl = confirmPasswordControl.parent.controls['password'];
  return passwordControl.value !== confirmPasswordControl.value ? {
    error: { notMatch: true }
  } : null;
};

export const usernameValidator = (usernameControl: FormControl): ValidationErrors | null => {
  if (!usernameControl.value.match(/^[a-z][a-z0-9_]*/) || usernameControl.value.length < 3) {
    return {
      error: { username: true }
    };
  }
  return null;
};

export const problemsetEnded = (problemset: ProblemsetInfo): boolean => {
  return problemset.endTime <= new Date().getTime();
};
