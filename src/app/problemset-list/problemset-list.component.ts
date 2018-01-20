import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { ApiService } from '../api.service';
import { ProblemsetInfo, RunMode, JudgeMode, PenaltyMode } from '../constants';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-problemset-list',
  templateUrl: './problemset-list.component.html',
  styleUrls: ['./problemset-list.component.css']
})
export class ProblemsetListComponent implements OnInit {

  problemsetGroups: {
    title: string,
    problemsetList: ProblemsetInfo[]
  }[];

  problemsetList: ProblemsetInfo[];

  error: { msg: string } | undefined;

  tooltip = {
    STANDARD_MODE: 'You can submit anytime before the problemset ends.',
    SELFTEST_MODE: 'The problemset has a fixed duration. You can start your session at any time. But once your ' +
    'session is started you cannot pause it. Only start your session when you have enough free time to work on ' +
    'the problemset.',
    OPEN_JUDGE: 'Submission results are available right after the submissions.',
    BLIND_JUDGE: 'Submission results will be available after the problemset ends. Scoreboard shows your maximum ' +
    'possible score if everything you submit is correct.',
    SCORE_PENALTY: 'Each incorrect submission results in 10% loss of a subtask\'s score.',
    TIME_PENALTY: 'Each incorrect submission results in 4 minutes extra time added to the finish time.',
    FREEBIES: 'Number of incorrect submissions that are exempted from penalty'
  };

  private fragment: string;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getProblemsetList();
    this.route.fragment.subscribe(fragment => { this.fragment = fragment; });
  }

  getProblemsetList(): void {
    this.api.getProblemsetList()
      .subscribe(
        (problemsetList: ProblemsetInfo[]) => {
          this.problemsetList = problemsetList;
          this.updateProblemsetGroups();
          this.error = undefined;
        },
        (err: HttpErrorResponse) => {
          this.error = err.error;
        }
      );
  }

  updateProblemsetGroups(): void {
    const inProgress = { title: 'Running Problemsets', problemsetList: [] };
    const scheduled = { title: 'Scheduled Problemsets', problemsetList: [] };
    const finished = { title: 'Finished Problemsets', problemsetList: [] };
    const now = new Date().getTime();
    for (let i = 0; i < this.problemsetList.length; i++) {
      const problemset = this.problemsetList[i];
      if (problemset.startTime <= now && now < problemset.endTime) {
        inProgress.problemsetList.push(problemset);
      } else if (now > problemset.endTime) {
        finished.problemsetList.push(problemset);
      } else {
        scheduled.problemsetList.push(problemset);
      }
    }
    this.problemsetGroups = [inProgress, scheduled, finished];
  }

  displayTime(t: number) {
    return moment(t).fromNow();
  }

  isBlindJudge(problemset: ProblemsetInfo): boolean {
    return problemset.judgeMode === JudgeMode.BLIND;
}

  isSelftestMode(problemset: ProblemsetInfo): boolean {
    return problemset.runMode === RunMode.SELFTEST;
  }

  isTimePenalty(problemset: ProblemsetInfo): boolean {
    return problemset.penaltyMode === PenaltyMode.TIME;
  }

}
