import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import * as moment from 'moment';

import { ApiService } from '../api.service';
import { CopyService } from '../copy.service';
import {
  Verdict,
  SubmissionColumnWidth as ColumnWidth,
  LanguageDisplay,
  SubmissionWithSource,
  ProblemsetInfo,
  SECOND_MS
} from '../constants';
import { executionTimeDisplay } from '../util';

import {
  TimeDisplayPipe,
  DateDisplayPipe,
  VerdictDisplayPipe,
  VerdictClassPipe
} from '../pipe';

const PENDING_RECHECK_INTERVAL = 10 * SECOND_MS;

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit, OnDestroy {

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private copy: CopyService
  ) { }

  problemset: ProblemsetInfo;
  submission: SubmissionWithSource;
  error: { msg: string } | undefined;

  private problemTitle: string;
  private rows = [];
  private columns = [];
  private recheckHandler: NodeJS.Timer | undefined;

  ngOnInit() {
    this.api.changeProblemsetId(this.route.snapshot.paramMap.get('problemsetId'));

    this.problemset = this.api.latestProblemset;
    this.api.getCurrentProblemset()
      .subscribe(problemset => {
        this.problemset = problemset;
      });

    this.getSubmission();

    const timeDisplayPipe = new TimeDisplayPipe();
    const dateDisplayPipe = new DateDisplayPipe();
    const verdictDisplayPipe = new VerdictDisplayPipe();
    const titleCasePipe = new TitleCasePipe();
    const columns = [
      {
        name: '#', prop: 'submissionNumber', sortable: false,
        ...ColumnWidth.SUBMISSION_NUMBER
      },
      {
        name: 'Problem', prop: 'problem', sortable: false,
        ...ColumnWidth.PROBLEM
      },
      {
        name: 'Subtask', prop: 'subtask', pipe: titleCasePipe, sortable: false,
        ...ColumnWidth.SUBTASK
      },
      {
        name: 'Lang', prop: 'language', sortable: false,
        ...ColumnWidth.LANGUAGE
      },
      {
        name: 'Verdict', prop: 'verdict', pipe: verdictDisplayPipe, sortable: false,
        cellClass: this.getCorrectClass,
        ...ColumnWidth.VERDICT
      },
      {
        name: 'Execution', prop: 'executionTimeDisplay', sortable: false,
        ...ColumnWidth.EXECUTION_TIME
      },
      // { name: 'Memory', prop: 'memoryDisplay', sortable: false },
      {
        name: 'Time', prop: 'problemsetTime', pipe: timeDisplayPipe, sortable: false,
        ...ColumnWidth.PROBLEMSET_TIME
      },
      {
        name: 'Date', prop: 'submitTime', pipe: dateDisplayPipe, sortable: false,
        ...ColumnWidth.SUBMIT_TIME
      }
    ];
    this.columns = columns;
  }

  ngOnDestroy() {
    if (this.recheckHandler !== undefined) {
      clearInterval(this.recheckHandler);
    }
  }

  getCorrectClass(cell: { row: { verdict: Verdict } }): string {
    // cell.value has been piped with VerdictDisplay, so we use original verdict value.
    const verdict = cell.row.verdict;
    // Add an empty space because cellClass function call does not.
    return ' ' + new VerdictClassPipe().transform(verdict);
  }

  getSubmission(): void {
    const problemsetId = this.route.snapshot.paramMap.get('problemsetId');
    const username = this.route.snapshot.paramMap.get('username');
    const submissionNumber = +this.route.snapshot.paramMap.get('submissionNumber');
    this.api.getSubmission(problemsetId, username, submissionNumber)
      .subscribe(
        submission => {
          this.submission = submission;
          this.update();
        },
        err => {
          this.api.loginErrorHandler(err);
          this.error = err.error;
        }
      );
  }

  update(): void {
    if (!this.problemset || !this.submission) {
      return;
    }
    this.error = undefined;
    this.updateTitle();
    this.updateTable();
    this.checkPending();
  }

  /**
   * If the submission verdict is PENDING, then recheck later.
   */
  private checkPending(): void {
    if (this.recheckHandler !== undefined) {
      clearInterval(this.recheckHandler);
    }
    if (this.submission.verdict !== Verdict.PENDING) {
      return;
    }
    const problemsetId = this.route.snapshot.paramMap.get('problemsetId');
    const username = this.route.snapshot.paramMap.get('username');
    const submissionNumber = +this.route.snapshot.paramMap.get('submissionNumber');

    this.recheckHandler = setInterval(() => {
      this.api.getSubmission(problemsetId, username, submissionNumber)
        .subscribe(submission => {
          this.submission = submission;
          this.update();
        });
    }, PENDING_RECHECK_INTERVAL);
  }

  private updateTable(): void {
    const problemNames: { [problemNumber: string]: string } = {};
    for (let i = 0; i < this.problemset.problems.length; i++) {
      const problem = this.problemset.problems[i];
      problemNames[problem.number] = `${problem.number} - ${problem.title}`;
    }

    const submission = this.submission;
    this.rows = [{
      ...submission,
      subtask: submission.subtask === 'all' ? '-' : submission.subtask,
      executionTimeDisplay: executionTimeDisplay(submission),
      // memoryDisplay: `${submission.verdict === Verdict.MLE ? '> ' : ''}${submission.memory}MB`,
      problem: problemNames[submission.problemNumber],
      submitTime: moment(submission.submitTime),
      language: LanguageDisplay[submission.language]
    }];
  }

  private updateTitle(): void {
    for (let i = 0; i < this.problemset.problems.length; i++) {
      const problem = this.problemset.problems[i];
      if (problem.number === this.submission.problemNumber) {
        this.problemTitle = `${problem.number} - ${problem.title}`;
        return;
      }
    }
  }

  getUsername(): string {
    return this.route.snapshot.paramMap.get('username');
  }

  copyText(text: string): void {
    this.copy.copyText(text, 'Source code copied');
  }

}
