import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ApiService } from '../api.service';
import { Submission, Verdict, SubmissionColumnWidth as ColumnWidth } from '../constants/submission';
import { LanguageDisplay } from '../constants/language';
import { ProblemsetInfo } from '../constants/problemset';

import { executionTimeDisplay, problemsetTimeDisplay } from '../util';

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
    private route: ActivatedRoute
  ) { }

  problemset: ProblemsetInfo;
  submissionList: Submission[];
  error: { msg: string } | undefined;

  private rows = [];
  private columns = [];

  ngOnInit() {
    this.api.changeProblemsetId(this.route.snapshot.paramMap.get('problemsetId'));

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
      {
        name: '#', prop: 'submissionNumber',
        ...ColumnWidth.SUBMISSION_NUMBER
      },
      {
        name: 'Problem', prop: 'problem',
        ...ColumnWidth.PROBLEM
      },
      {
        name: 'Subtask', prop: 'subtask', pipe: titleCasePipe,
        ...ColumnWidth.SUBTASK
      },
      {
        name: '', prop: 'sourceCode', cellTemplate: this.sourceLinkTmpl, cellClass: 'center', sortable: false,
        ...ColumnWidth.SOURCE_CODE
      },
      {
        name: 'Verdict', prop: 'verdict', pipe: verdictDisplayPipe, cellClass: this.getCorrectClass,
        ...ColumnWidth.VERDICT
      },
      {
        name: 'Lang', prop: 'language',
        ...ColumnWidth.LANGUAGE
      },
      {
        name: 'Execution', prop: 'executionTimeDisplay', comparator: this.executionTimeSorter,
        ...ColumnWidth.EXECUTION_TIME
      },
      {
        name: 'Time', prop: 'problemsetTime', pipe: timeDisplayPipe,
        ...ColumnWidth.PROBLEMSET_TIME
      },
      {
        name: 'Date', prop: 'submitTime', pipe: dateDisplayPipe,
        ...ColumnWidth.SUBMIT_TIME
      }
    ];
  }

  executionTimeSorter(valueA: string, valueB: string, // values are display strings
                      rowA: { executionTime: number }, rowB: { executionTime: number }): number {
    return Math.sign(rowA.executionTime - rowB.executionTime);
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
        subtask: submission.subtask === 'all' ? '-' : submission.subtask,
        executionTimeDisplay: executionTimeDisplay(submission),
        problem: problemNames[submission.problemNumber],
        problemsetTime: problemsetTimeDisplay(submission),
        submitTime: submission.submitTime,
        language: LanguageDisplay[submission.language],
        sourceCode: submission.submissionNumber
      });
    }
    this.rows = newRows;
  }

  getSourceLink(submissionNumber: string): string {
    const problemsetId = this.route.snapshot.paramMap.get('problemsetId');
    const username = this.route.snapshot.paramMap.get('username');
    return `/problemset/${problemsetId}/submission/${username}/${submissionNumber}`;
  }

  getUsername(): string {
    return this.route.snapshot.paramMap.get('username');
  }

}
