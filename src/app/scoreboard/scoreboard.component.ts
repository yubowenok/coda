import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

import { ApiService } from '../api.service';
import { MessageService } from '../message.service';

import {
  ProblemsetInfo,
  ParticipantScore,
  ProblemInfo,
  SubtaskInfo,
  Scoreboard,
  ScoreboardColumnWidth as ColumnWidth
} from '../constants';

import * as time from '../constants/time';
import { TimeDisplayPipe } from '../pipe/time-display.pipe';

enum Mode {
  SCORE = 'score',
  ATTEMPTS = 'attempts',
  TIME = 'time'
}

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit, OnDestroy {

  @ViewChild('headerTmpl') headerTmpl: TemplateRef<any>;
  @ViewChild('attemptsTmpl') attemptsTmpl: TemplateRef<any>;
  @ViewChild('scoreTmpl') scoreTmpl: TemplateRef<any>;
  @ViewChild('timeTmpl') timeTmpl: TemplateRef<any>;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private message: MessageService
  ) { }

  problemset: ProblemsetInfo;
  scoreboard: Scoreboard;
  error: { msg: string } | undefined;

  private rows = [];
  private selected = [];
  private selectedRow;
  private columns = [];
  private mode = Mode.SCORE;

  private currentProblemSubscription: Subscription;

  ngOnInit() {
    this.api.changeProblemsetId(this.route.snapshot.paramMap.get('problemsetId'));

    this.problemset = this.api.latestProblemset;
    this.currentProblemSubscription = this.api.getCurrentProblemset()
      .subscribe(problemset => {
        this.problemset = problemset;
        this.updateTable();
      });

    this.getScoreboard();
  }

  ngOnDestroy() {
    this.currentProblemSubscription.unsubscribe();
  }

  getScoreboard(): void {
    const problemsetId = this.route.snapshot.paramMap.get('problemsetId');
    if (!problemsetId) {
      this.error = { msg: 'invalid problemset id' };
      return;
    }
    this.api.getScoreboard(problemsetId)
      .subscribe(
        scoreboard => {
          this.scoreboard = scoreboard;
          this.sortParticipants();
          this.updateTable();
        },
        err => {
          this.api.loginErrorHandler(err);
          this.error = err.error;
        }
      );
  }

  getModeTemplate(): TemplateRef<any> {
    if (this.mode === Mode.ATTEMPTS) {
      return this.attemptsTmpl;
    } else if (this.mode === Mode.SCORE) {
      return this.scoreTmpl;
    } else {
      return this.timeTmpl;
    }
  }

  onModeChange() {
    const subtaskTemplate = this.getModeTemplate();
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i].cellTemplate) {
        this.columns[i] = Object.assign({}, this.columns[i], {cellTemplate : subtaskTemplate});
      }
    }
    this.columns = [...this.columns];
  }

  sortParticipants(): void {
    this.scoreboard.participants.sort(function(a: ParticipantScore, b: ParticipantScore): number {
      if (a.score === b.score) {
        if (a.finishTime === b.finishTime) {
          return a.name === b.name ? 0 : (a.name < b.name ? -1 : 1);
        }
        return a.finishTime - b.finishTime;
      }
      return b.score - a.score;
    });
  }

  updateTable(): void {
    if (!this.problemset || !this.scoreboard) { // Must async load two parts
      return;
    }

    const timeDisplayPipe = new TimeDisplayPipe();
    const subtaskTemplate = this.getModeTemplate();
    const newColumns: {}[] = [
      { name: 'Rank', ...ColumnWidth.RANK },
      { name: 'Name' },
      { name: 'Score', ...ColumnWidth.SCORE },
      { name: 'Finish Time', prop: 'finishTime', pipe: timeDisplayPipe }
    ];

    for (let i = 0; i < this.problemset.problems.length; i++) {
      const problem: ProblemInfo = this.problemset.problems[i];

      for (let j = 0; j < problem.subtasks.length; j++) {
        const subtask: SubtaskInfo = problem.subtasks[j];
        newColumns.push({
          name: problem.isSingleTask ? problem.number :
            `${problem.number} - ${new TitleCasePipe().transform(subtask.id)}`,
          prop: `${problem.number}_${subtask.id}`,
          score: subtask.score,
          headerClass: 'header center',
          headerTemplate: this.headerTmpl,
          cellClass: 'center',
          cellTemplate: subtaskTemplate,
          sortable: false
        });
      }
    }

    const newRows = [];
    for (let i = 0; i < this.scoreboard.participants.length; i++) {
      const participant: ParticipantScore = this.scoreboard.participants[i];
      let rank = 1;
      if (i) {
        const previousParticipant = this.scoreboard.participants[i - 1];
        rank = participant.score === previousParticipant.score &&
          participant.finishTime === previousParticipant.finishTime ? newRows[i - 1].rank : i + 1;
      }
      const row = {
        rank: rank,
        name: participant.name,
        username: participant.username,
        score: participant.score,
        finishTime: participant.finishTime
      };
      for (let j = 0; j < this.problemset.problems.length; j++) {
        const problem: ProblemInfo = this.problemset.problems[j];
        for (let k = 0; k < problem.subtasks.length; k++) {
          const subtask: SubtaskInfo = problem.subtasks[k];
          const subtaskIndex = `${problem.number}_${subtask.id}`;
          if (participant.problems[problem.number] === undefined) {
            row[subtaskIndex] = { attempts: 0 };
          } else {
            row[subtaskIndex] = participant.problems[problem.number][subtask.id];
            if (row[subtaskIndex]) {
              // assign username so that we can goto submission link
              row[subtaskIndex].username = participant.username;
            }
          }
        }
      }
      if (this.api.getCurrentUser() && row.username === this.api.getCurrentUser().username) {
        this.selectedRow = row;
        this.selected = [row];
      }
      newRows.push(row);
    }

    this.columns = newColumns;
    this.rows = newRows;
  }

  onSelect() {
    // Fix selection at current user
    this.selected = [this.selectedRow];
  }

  gotoSubmissionLink(cell: { username?: string, submissionNumber: string }): void {
    if (!cell.submissionNumber || !cell.username) {
      this.message.info('source code not available');
    } else {
      this.router.navigate([
        `/problemset/${this.problemset.id}/submission/${cell.username}/${cell.submissionNumber}`
      ]);
    }
  }
}
