import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';

import { Submission, Verdict, VerdictDisplay } from '../constants/submission';
import { LanguageDisplay } from '../constants/language';
import { ProblemsetInfo } from '../constants/problemset';

import * as moment from 'moment';
import { DateDisplayPipe } from '../pipes/date-display.pipe';
import { TimeDisplayPipe } from '../pipes/time-display.pipe';
import { VerdictDisplayPipe } from '../pipes/verdict-display.pipe';

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

  private problemset: ProblemsetInfo;
  private submissionList: Submission[];
  private rows = [];
  private columns = [];

  ngOnInit() {
    this.getSubmissionList();

    const timeDisplayPipe = new TimeDisplayPipe();
    const dateDisplayPipe = new DateDisplayPipe();
    const verdictDisplayPipe = new VerdictDisplayPipe();
    const titleCasePipe = new TitleCasePipe();
    this.columns = [
      { name: '#', prop: 'id', maxWidth: 80 },
      { name: 'Problem', prop: 'problem' },
      { name: 'Subtask', prop: 'subtask', pipe: titleCasePipe, maxWidth: 80 },
      { name: 'Language', prop: 'language', maxWidth: 80},
      { name: 'Verdict', prop: 'verdict', cellClass: this.getCorrectClass, pipe: verdictDisplayPipe },
      { name: 'Time', prop: 'problemsetTime', pipe: timeDisplayPipe, maxWidth: 100 },
      { name: 'Date', prop: 'submitTime', pipe: dateDisplayPipe },
      { name: 'Source', cellTemplate: this.sourceLinkTmpl, maxWidth: 80, cellClass: 'center' }
    ];
  }

  getCorrectClass(cell: { row: { verdict: Verdict } }): string {
    // cell.value has been piped with VerdictDisplay, so we use original verdict value.
    const verdict = cell.row.verdict;
    if (verdict === Verdict.AC) {
      return ' correct bold';
    } else if (verdict === Verdict.PENDING || verdict === Verdict.SKIPPED) {
      return ' bold';
    } else {
      return ' incorrect bold';
    }
  }

  getSubmissionList(): void {
    const problemsetId = this.route.snapshot.paramMap.get('problemsetId');
    // TODO: const username = '';
    this.api.getProblemset(problemsetId)
      .subscribe(problemset => {
        this.problemset = problemset;
        this.updateTable();
      });
    this.api.getSubmissionList(problemsetId, '')
      .subscribe(submissionList => {
        this.submissionList = submissionList;
        this.updateTable();
      });
  }

  updateTable(): void {
    if (!this.problemset || !this.submissionList) {
      return;
    }

    const problemNames: { [problemNumber: string]: string } = {};
    for (let i = 0; i < this.problemset.problems.length; i++) {
      const problem = this.problemset.problems[i];
      problemNames[problem.number] = `${problem.number} - ${problem.title}`;
    }

    const newRows = [];
    for (let i = 0; i < this.submissionList.length; i++) {
      const submission = this.submissionList[i];
      newRows.push({
        id: submission.id,
        problem: problemNames[submission.problemNumber],
        subtask: submission.subtask,
        problemsetTime: submission.problemsetTime,
        verdict: submission.verdict,
        submitTime: moment(submission.submitTime),
        language: LanguageDisplay[submission.language]
      });
    }
    this.rows = newRows;
  }

}
