import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ApiService } from '../api.service';
import {ActivatedRoute, Router} from '@angular/router';

import { Submission, Verdict } from '../constants/submission';
import { LanguageDisplay } from '../constants/language';
import { ProblemsetInfo } from '../constants/problemset';

import {
  DateDisplayPipe,
  TimeDisplayPipe,
  VerdictDisplayPipe,
  VerdictClassPipe
} from '../pipe';

@Component({
  selector: 'app-submission-list',
  templateUrl: './submission-list.component.html',
  styleUrls: ['./submission-list.component.css']
})
export class SubmissionListComponent implements OnInit {

  @ViewChild('sourceLinkTmpl') sourceLinkTmpl: TemplateRef<any>;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  private problemset: ProblemsetInfo;
  private submissionList: Submission[];
  private rows = [];
  private columns = [];
  private error: { msg: string } | undefined;

  private listMessages = {
    emptyMessage: 'User has no submissions'
  };

  ngOnInit() {
    this.api.onProblemsetIdChange(this.route.snapshot.paramMap.get('problemsetId'));

    this.problemset = this.api.latestProblemset;
    this.api.getCurrentProblemset()
      .subscribe(problemset => {
        this.problemset = problemset;
        this.updateTable();
      });

    this.getSubmissionList();

    const timeDisplayPipe = new TimeDisplayPipe();
    const dateDisplayPipe = new DateDisplayPipe();
    const verdictDisplayPipe = new VerdictDisplayPipe();
    const titleCasePipe = new TitleCasePipe();
    this.columns = [
      { name: '#', prop: 'submissionNumber',
        minWidth: 30, maxWidth: 50 },
      { name: 'Problem', prop: 'problem' },
      { name: 'Subtask', prop: 'subtask', pipe: titleCasePipe,
        minWidth: 80, maxWidth: 80 },
      { name: '', prop: 'link', cellTemplate: this.sourceLinkTmpl, cellClass: 'center', sortable: false,
        minWidth: 20, maxWidth: 20 },
      { name: 'Verdict', prop: 'verdict', pipe: verdictDisplayPipe, cellClass: this.getCorrectClass,
        minWidth: 185 },
      { name: 'Lang', prop: 'language',
        minWidth: 60, maxWidth: 60},
      { name: 'Execution', prop: 'executionTimeDisplay', comparator: this.executionTimeSorter },
      // { name: 'Memory', prop: 'memoryDisplay', comparator: this.memorySorter },
      { name: 'Time', prop: 'problemsetTime', pipe: timeDisplayPipe,
        minWidth: 100, maxWidth: 100 },
      { name: 'Date', prop: 'submitTime', pipe: dateDisplayPipe,
        minWidth: 210, maxWidth: 210 }
    ];
  }

  executionTimeSorter(valueA: string, valueB: string, // values are display strings
                      rowA: { executionTime: number }, rowB: { executionTime: number }): number {
    return Math.sign(rowA.executionTime - rowB.executionTime);
  }

  memorySorter(valueA: string, valueB: string, // values are display strings
               rowA: { memory: number }, rowB: { memory: number }): number {
    return Math.sign(rowA.memory - rowB.memory);
  }

  getCorrectClass(cell: { row: { verdict: Verdict } }): string {
    // cell.value has been piped with VerdictDisplay, so we use original verdict value.
    const verdict = cell.row.verdict;
    // Add an empty space because cellClass function call does not.
    return ' ' + new VerdictClassPipe().transform(verdict);
  }

  getSubmissionList(): void {
    const problemsetId = this.route.snapshot.paramMap.get('problemsetId');
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) {
      this.error = { msg: 'invalid username' };
      return;
    }
    this.api.getSubmissionList(problemsetId, username)
      .subscribe(
        submissionList => {
          this.submissionList = submissionList;
          this.updateTable();
        },
        err => {
          this.api.loginErrorHandler(err);
          this.error = err.error;
        }
      );
  }

  updateTable(): void {
    if (!this.problemset || !this.submissionList) {
      return;
    }
    this.error = undefined;

    const problemNames: { [problemNumber: string]: string } = {};
    for (let i = 0; i < this.problemset.problems.length; i++) {
      const problem = this.problemset.problems[i];
      problemNames[problem.number] = `${problem.number} - ${problem.title}`;
    }

    const newRows = [];
    for (let i = 0; i < this.submissionList.length; i++) {
      const submission = this.submissionList[i];
      newRows.push({
        ...submission,
        executionTimeDisplay: this.getExecutionTimeDisplay(submission),
        // memoryDisplay: this.getMemoryDisplay(submission),
        problem: problemNames[submission.problemNumber],
        problemsetTime: submission.outsideProblemsetTime ? -1 : submission.problemsetTime,
        submitTime: submission.submitTime,
        language: LanguageDisplay[submission.language],
        link: submission.submissionNumber
      });
    }
    this.rows = newRows;
  }

  getExecutionTimeDisplay(submission: Submission): string {
    if (submission.verdict === Verdict.PENDING || submission.verdict === Verdict.SKIPPED) {
      return '-';
    }
    return `${submission.verdict === Verdict.TLE ? '> ' : ''}${submission.executionTime}s`;
  }

  /*
  getMemoryDisplay(submission: Submission): string {
    if (submission.verdict === Verdict.PENDING || submission.verdict === Verdict.SKIPPED) {
      return '-';
    }
    return `${submission.verdict === Verdict.MLE ? '> ' : ''}${submission.memory}MB`;
  }
  */

  getSourceLink(submissionNumber: string): string {
    const problemsetId = this.route.snapshot.paramMap.get('problemsetId');
    const username = this.route.snapshot.paramMap.get('username');
    return `/problemset/${problemsetId}/submission/${username}/${submissionNumber}`;
  }

  getUsername(): string {
    return this.route.snapshot.paramMap.get('username');
  }

}
