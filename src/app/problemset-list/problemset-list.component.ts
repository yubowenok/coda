import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { ApiService } from '../api.service';
import { ProblemsetInfo, RunMode, JudgeMode, PenaltyMode } from '../constants';

@Component({
  selector: 'app-problemset-list',
  templateUrl: './problemset-list.component.html',
  styleUrls: ['./problemset-list.component.css']
})
export class ProblemsetListComponent implements OnInit {

  constructor(
    private api: ApiService,
    private route: ActivatedRoute
  ) { }

  problemsetList: ProblemsetInfo[];

  private fragment: string;

  tooltips = {
    STANDARD_MODE: 'You can submit anytime before the problemset ends.',
    SELFTEST_MODE: 'The problemset has a fixed duration. You can start your session at any time. But once your ' +
      'session is started you cannot pause it. Only start your session when you have enough free time to work on ' +
      'the problemset.',
    OPEN_JUDGE: 'Submission results are available right after the submissions.',
    BLIND_JUDGE: 'Submission results will be available after the problemset ends. You will temporarily receive ' +
      'score for attempted problems.',
    SCORE_PENALTY: 'Each incorrect submission results in 10% loss of a subtask\'s score.',
    TIME_PENALTY: 'Each incorrect submission results in 4 minutes extra time added to the finish time.'
  };

  ngOnInit() {
    this.getProblemsetList();
    this.route.fragment.subscribe(fragment => { this.fragment = fragment; });
  }

  getProblemsetList(): void {
    this.api.getProblemsetList()
      .subscribe(problemsetList => this.problemsetList = problemsetList);
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

  isScorePenalty(problemset: ProblemsetInfo): boolean {
    return problemset.penaltyMode === PenaltyMode.SCORE;
  }

  isTimePenalty(problemset: ProblemsetInfo): boolean {
    return problemset.penaltyMode === PenaltyMode.TIME;
  }

}
