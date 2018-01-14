import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

import { ProblemsetInfo } from '../constants/problemset';
import { ParticipantScore, Scoreboard } from '../constants/scoreboard';
import { ProblemInfo, SubtaskInfo } from '../constants/problem';

import * as time from '../constants/time';
import { TimeDisplayPipe } from '../pipes/time-display.pipe';

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
export class ScoreboardComponent implements OnInit {

  @ViewChild('headerTmpl') headerTmpl: TemplateRef<any>;
  @ViewChild('attemptsTmpl') attemptsTmpl: TemplateRef<any>;
  @ViewChild('scoreTmpl') scoreTmpl: TemplateRef<any>;
  @ViewChild('timeTmpl') timeTmpl: TemplateRef<any>;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute
  ) { }

  private problemset: ProblemsetInfo;
  private scoreboard: Scoreboard;
  private unavailable = false;
  private rows = [];
  private columns = [];

  private mode = Mode.SCORE;

  ngOnInit() {
    this.getScoreboard();
  }

  getScoreboard(): void {
    const problemsetId = this.route.snapshot.paramMap.get('problemsetId');
    if (problemsetId === undefined) {
      return;
    }
    this.api.getProblemset(problemsetId)
      .subscribe(problemset => {
        this.problemset = problemset;
        this.updateTable();
      });
    this.api.getScoreboard(problemsetId)
      .subscribe(scoreboard => {
        this.scoreboard = scoreboard;
        this.sortParticipants();
        this.updateTable();
      });
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
      { name: 'Rank', maxWidth: 80 },
      { name: 'Name' },
      { name: 'Score', minWidth: 50, maxWidth: 60 },
      { name: 'Finish Time', prop: 'finishTime', pipe: timeDisplayPipe }
    ];

    for (let i = 0; i < this.problemset.problems.length; i++) {
      const problem: ProblemInfo = this.problemset.problems[i];

      for (let j = 0; j < problem.subtasks.length; j++) {
        const subtask: SubtaskInfo = problem.subtasks[j];
        newColumns.push({
          name: `${problem.number} - ${new TitleCasePipe().transform(subtask.id)}`,
          prop: `${problem.number}_${subtask.id}`,
          score: subtask.score,
          headerClass: 'header center',
          headerTemplate: this.headerTmpl,
          cellClass: 'center',
          cellTemplate: subtaskTemplate
        });
      }
    }

    const newRows = [];
    for (let i = 0; i < this.scoreboard.participants.length; i++) {
      const participant: ParticipantScore = this.scoreboard.participants[i];
      const row = {
        rank: i + 1,
        name: participant.name,
        score: participant.score,
        finishTime: participant.finishTime
      };
      for (let j = 0; j < this.problemset.problems.length; j++) {
        const problem: ProblemInfo = this.problemset.problems[j];
        for (let k = 0; k < problem.subtasks.length; k++) {
          const subtask: SubtaskInfo = problem.subtasks[k];
          const subtaskIndex = `${problem.number}_${subtask.id}`;
          if (participant.problems[problem.number] === undefined) {
            row[subtaskIndex] = {attempts: 0};
          } else {
            row[subtaskIndex] = participant.problems[problem.number][subtask.id];
          }
        }
      }
      newRows.push(row);
    }

    this.columns = newColumns;
    this.rows = newRows;
  }
}
