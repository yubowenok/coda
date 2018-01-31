import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ApiService } from '../api.service';
import {
  Submission,
  SubmissionTableColumns,
  LanguageDisplay,
  ProblemsetInfo
} from '../constants';
import { executionTimeDisplay, problemsetTimeDisplay } from '../util';

@Component({
  selector: 'app-submission-list',
  templateUrl: './submission-list.component.html',
  styleUrls: ['./submission-list.component.css']
})
export class SubmissionListComponent implements OnInit, OnDestroy {

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

  private currentProblemSubscription: Subscription;

  ngOnInit() {
    this.api.changeProblemsetId(this.route.snapshot.paramMap.get('problemsetId'));

    this.problemset = this.api.latestProblemset;
    this.currentProblemSubscription = this.api.getCurrentProblemset()
      .subscribe(problemset => {
        this.problemset = problemset;
        this.updateTable();
      });

    this.getSubmissionList();

    const sourceCodeColumn = {
      name: '',
      prop: 'sourceCode',
      cellTemplate: this.sourceLinkTmpl,
      cellClass: 'center',
      sortable: false,
      maxWidth: 20
    };
    // insert sourceCodeColumn before the verdict column
    const verdictIndex = SubmissionTableColumns.map(column => column.prop).indexOf('verdict');
    const columns = SubmissionTableColumns.concat();
    columns.splice(verdictIndex - 1, 0, sourceCodeColumn);
    this.columns = columns;
  }

  ngOnDestroy() {
    this.currentProblemSubscription.unsubscribe();
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

  getRouteUsername(): string {
    return this.route.snapshot.params.username;
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
