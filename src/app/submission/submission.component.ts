import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';

import * as moment from 'moment';

import { Verdict } from '../constants/submission';
import { LanguageDisplay } from '../constants/language';

import { TitleCasePipe } from '@angular/common';
import { SubmissionWithSource } from '../constants/submission';
import { ProblemsetInfo } from '../constants/problemset';
import { CopyService } from '../copy.service';
import {
  TimeDisplayPipe,
  DateDisplayPipe,
  VerdictDisplayPipe,
  VerdictClassPipe
} from '../pipe';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private copy: CopyService
  ) { }

  private problemset: ProblemsetInfo;
  private submission: SubmissionWithSource;
  private problemTitle: string;
  private rows = [];
  private columns = [];
  private error: { msg: string } | undefined;

  ngOnInit() {
    this.api.onProblemsetIdChange(this.route.snapshot.paramMap.get('problemsetId'));

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
      { name: '#', prop: 'submissionNumber', maxWidth: 80, sortable: false },
      { name: 'Problem', prop: 'problem', sortable: false },
      { name: 'Subtask', prop: 'subtask', pipe: titleCasePipe, sortable: false,
        minWidth: 80, maxWidth: 80 },
      { name: 'Lang', prop: 'language', sortable: false,
        minWidth: 60, maxWidth: 60 },
      { name: 'Verdict', prop: 'verdict', pipe: verdictDisplayPipe, sortable: false,
        cellClass: this.getCorrectClass,
        minWidth: 185 },
      { name: 'Execution', prop: 'executionTimeDisplay', sortable: false },
      { name: 'Memory', prop: 'memoryDisplay', sortable: false },
      { name: 'Time', prop: 'problemsetTime', pipe: timeDisplayPipe, sortable: false,
        minWidth: 100, maxWidth: 100 },
      { name: 'Date', prop: 'submitTime', pipe: dateDisplayPipe, sortable: false,
        minWidth: 210, maxWidth: 210 }
    ];
    this.columns = columns;
  }

  getCorrectClass(cell: { row: { verdict: Verdict } }): string {
    // cell.value has been piped with VerdictDisplay, so we use original verdict value.
    const verdict = cell.row.verdict;
    // Add an empty space because cellClass function call does not.
    return ' ' + new VerdictClassPipe().transform(verdict);
  }

  getSubmission(): void {
    const submissionNumber = this.route.snapshot.paramMap.get('submissionNumber');
    const username = this.route.snapshot.paramMap.get('username');
    const problemsetId = this.route.snapshot.paramMap.get('problemsetId');
    this.api.getSubmission(problemsetId, username, submissionNumber) // TODO: add username
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
      executionTimeDisplay: `${submission.verdict === Verdict.TLE ? '> ' : ''}${submission.executionTime}s`,
      memoryDisplay: `${submission.verdict === Verdict.MLE ? '> ' : ''}${submission.memory}MB`,
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
