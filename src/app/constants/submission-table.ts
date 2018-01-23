import { TitleCasePipe } from '@angular/common';
import { Verdict } from './submission';
import {
  DateDisplayPipe,
  TimeDisplayPipe,
  VerdictDisplayPipe,
  VerdictClassPipe
} from '../pipe';

const ColumnWidth = {
  SUBMISSION_NUMBER: { maxWidth: 40 },
  PROBLEM: {},
  SUBTASK: { maxWidth: 100 },
  VERDICT: {}, // maxWidth: 185
  LANGUAGE: { maxWidth: 75 },
  EXECUTION_TIME: {}, // maxWidth: 80
  PROBLEMSET_TIME: {}, //  maxWidth: 90
  SUBMIT_TIME: { minWidth: 200 } // maxWidth: 220
};

/**
 * Determines ngx-datatable cell class for verdicts.
 */
const getVerdictClass = (cell: { row: { verdict: Verdict } }): string => {
  // cell.value has been piped with VerdictDisplay, so we use original verdict value.
  const verdict = cell.row.verdict;
  // Add an empty space because cellClass function call does not.
  return ' ' + new VerdictClassPipe().transform(verdict);
};

/**
 * Sorts execution time column in ngx-datatable.
 */
const executionTimeSorter = (valueA: string, valueB: string, // values are display strings that are not sortable
                             rowA: { executionTime: number }, rowB: { executionTime: number }): number => {
  return Math.sign(rowA.executionTime - rowB.executionTime);
};

/**
 * Column definitions for ngx-datatable showing submissions.
 */
export const SubmissionTableColumns = [
  {
    name: '#', prop: 'submissionNumber',
    ...ColumnWidth.SUBMISSION_NUMBER
  },
  {
    name: 'Problem', prop: 'problem',
    ...ColumnWidth.PROBLEM
  },
  {
    name: 'Subtask', prop: 'subtask', pipe: new TitleCasePipe(),
    ...ColumnWidth.SUBTASK
  },
  {
    name: 'Verdict', prop: 'verdict', pipe: new VerdictDisplayPipe(), cellClass: getVerdictClass,
    ...ColumnWidth.VERDICT
  },
  {
    name: 'Lang', prop: 'language',
    ...ColumnWidth.LANGUAGE
  },
  {
    name: 'Execution', prop: 'executionTimeDisplay', comparator: executionTimeSorter,
    ...ColumnWidth.EXECUTION_TIME
  },
  {
    name: 'Time', prop: 'problemsetTime', pipe: new TimeDisplayPipe(),
    ...ColumnWidth.PROBLEMSET_TIME
  },
  {
    name: 'Date', prop: 'submitTime', pipe: new DateDisplayPipe(),
    ...ColumnWidth.SUBMIT_TIME
  }
];
