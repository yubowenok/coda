import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ApiService } from '../api.service';
import {
  Submission,
  SubmissionTableColumns,
  LanguageDisplay,
  ProblemsetInfo,
  SubtaskInfo
} from '../constants';
import { executionTimeDisplay, problemsetTimeDisplay } from '../util';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit, OnDestroy {
  @ViewChild('sourceLinkTmpl') sourceLinkTmpl: TemplateRef<any>;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute
  ) { }

  problemset: ProblemsetInfo;
  queue: Submission[];
  error: { msg: string } | undefined;

  private rows = [];
  private allRows = [];
  private columns = [];

  private usernameFilter = '';
  private excludeTestAndPractice = false;
  private currentProblemsetSubscription: Subscription;

  private selectedProblem = '';
  private selectedSubtask = '';
  private subtasks: SubtaskInfo[] = [];

  ngOnInit() {
    this.api.changeProblemsetId(this.route.snapshot.paramMap.get('problemsetId'));

    this.problemset = this.api.latestProblemset;
    this.currentProblemsetSubscription = this.api.getCurrentProblemset()
      .subscribe(problemset => {
        this.problemset = problemset;
        this.updateTable();
      });

    this.getQueue();

    const usernameColumn = {
      name: 'Username',
      prop: 'username',
      sortable: true
    };
    const sourceCodeColumn = {
      name: '',
      prop: 'sourceCode',
      cellTemplate: this.sourceLinkTmpl,
      cellClass: 'center',
      sortable: false,
      maxWidth: 20
    };
    // insert sourceCodeColumn before the verdict column
    const verdictIndex = SubmissionTableColumns.map(column => column.prop)
      .indexOf('verdict');
    const columns = SubmissionTableColumns.concat();
    columns.splice(0, 0, usernameColumn);
    columns.splice(verdictIndex - 1, 0, sourceCodeColumn);
    this.columns = columns;
  }

  ngOnDestroy() {
    this.currentProblemsetSubscription.unsubscribe();
  }

  getQueue(): void {
    const problemsetId = this.route.snapshot.paramMap.get('problemsetId');
    this.api.getQueue(problemsetId)
      .subscribe(
        queue => {
          this.queue = queue;
          this.updateTable();
        },
        err => {
          this.api.loginErrorHandler(err);
          this.error = err.error;
        }
      );
  }

  updateTable(): void {
    if (!this.problemset || !this.queue) {
      return;
    }
    this.error = undefined;

    const problemNames: { [problemNumber: string]: string } = {};
    for (let i = 0; i < this.problemset.problems.length; i++) {
      const problem = this.problemset.problems[i];
      problemNames[problem.number] = `${problem.number} - ${problem.title}`;
    }

    const newRows = [];
    for (let i = 0; i < this.queue.length; i++) {
      const submission = this.queue[i];
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
    this.allRows = newRows.concat();
    this.rows = newRows;
  }

  onExcludeTestAndPracticeChange() {
    this.updateFilter();
  }

  onUsernameFilterChange(event: { target: { value: string }}): void {
    this.usernameFilter = event.target.value.toLowerCase();
    this.updateFilter();
  }

  onProblemChange() {
    this.getSubtasks();
    this.selectedSubtask = '';
    this.updateFilter();
  }

  onSubtaskChange() {
    this.updateFilter();
  }

  updateFilter(): void {
    this.rows = this.allRows.concat().filter(row => {
      if (this.usernameFilter && row.username.toLowerCase().indexOf(this.usernameFilter) === -1) {
        return false;
      }
      if (this.excludeTestAndPractice && (row.problemsetTime === '' || row.problemsetTime < 0)) {
        return false;
      }
      if (this.selectedProblem && row.problemNumber !== this.selectedProblem) {
        return false;
      }
      if (this.selectedSubtask && row.subtask !== this.selectedSubtask) {
        return false;
      }
      return true;
    });
  }

  getSubtasks(): void {
    if (!this.problemset) {
      return;
    }
    for (let i = 0; i < this.problemset.problems.length; i++) {
      if (this.problemset.problems[i].number === this.selectedProblem) {
        this.subtasks = this.problemset.problems[i].subtasks;
        return;
      }
    }
  }

  selectedProblemHasSubtask(): boolean {
    if (!this.selectedProblem) {
      return false;
    }
    return this.subtasks.length > 1;
  }

  getSourceLink(row: { username: string, submissionNumber: string }): string {
    const problemsetId = this.route.snapshot.paramMap.get('problemsetId');
    return `/problemset/${problemsetId}/submission/${row.username}/${row.submissionNumber}`;
  }

}
