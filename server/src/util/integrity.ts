import * as paths from '../constants/path';
import {
  JudgeMode,
  ProblemsetConfig
} from '../constants';

const checkProblemsetIntegrity = (problemset: ProblemsetConfig): void => {
  if (problemset.judgeMode === JudgeMode.BLIND && problemset.freebies) {
    console.error(`problemset ${problemset.id} has blind judge but non-zero freebies`);
  }
};

/**
 * Checks the integrity of all problemsets.
 */
export const checkProblemsetsIntegrity = (): void => {
  console.log('TODO: checkProblemsetsIntegrity');
};

/**
 * Checks the integrity of all problems.
 */
export const checkProblemsIntegrity = (): void => {
  console.log('TODO: checkProblemsIntegrity');
};
