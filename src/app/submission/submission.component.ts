import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';

import { ApiService } from '../api.service';
import { CopyService } from '../copy.service';
import {
  Verdict,
  SubmissionTableColumns,
  LanguageDisplay,
  SubmissionWithSource,
  ProblemsetInfo,
  SECOND_MS
} from '../constants';
import { executionTimeDisplay, problemsetTimeDisplay } from '../util';

const PENDING_RECHECK_INTERVAL = 3 * SECOND_MS;

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

  private currentProblemsetSubscription: Subscription;

  ngOnInit() {
    this.api.changeProblemsetId(this.route.snapshot.paramMap.get('problemsetId'));

    this.problemset = this.api.latestProblemset;
    this.currentProblemsetSubscription = this.api.getCurrentProblemset()
      .subscribe(problemset => {
        this.problemset = problemset;
      });

    this.getSubmission();

    this.columns = SubmissionTableColumns.filter(column => {
      return column.prop !== 'source';
    });
  }

  ngOnDestroy() {
    if (this.recheckHandler !== undefined) {
      clearInterval(this.recheckHandler);
    }
    this.currentProblemsetSubscription.unsubscribe();
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
      problemsetTime: problemsetTimeDisplay(submission),
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
