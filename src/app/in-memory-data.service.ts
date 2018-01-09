import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

import * as problemset from './constants/problemset';

@Injectable()
export class InMemoryDataService implements InMemoryDbService {

  constructor() { }

  private ONE_DAY_MS = 1000 * 60 * 60 * 24;

  getStartTime(): number {
    return (new Date()).getTime() + (Math.random() * this.ONE_DAY_MS * 14 - 7 * this.ONE_DAY_MS);
  }

  getEndTime(startTime: number) {
    return startTime + Math.random() * 7 * this.ONE_DAY_MS;
  }

  getStartEndTime() {
    const startTime = this.getStartTime();
    const endTime = this.getEndTime(startTime);
    return { startTime, endTime };
  }

  createDb() {
    const problemsetList = [
      {
        id: 'set1',
        title: 'Test Problemset 1',
        startTime: this.getStartTime(),
        runMode: problemset.RunMode.STANDARD,
        judgeMode: problemset.JudgeMode.OPEN,
        penaltyMode: problemset.PenaltyMode.SCORE,
        ...this.getStartEndTime()
      },
      {
        id: 'set2',
        title: 'Test Problemset 2',
        runMode: problemset.RunMode.SELFTEST,
        judgeMode: problemset.JudgeMode.BLIND,
        penaltyMode: problemset.PenaltyMode.TIME,
        ...this.getStartEndTime()
      },
      {
        id: 'set3',
        title: 'Test Problemset 3',
        runMode: problemset.RunMode.STANDARD,
        judgeMode: problemset.JudgeMode.OPEN,
        penaltyMode: problemset.PenaltyMode.SCORE,
        ...this.getStartEndTime()
      },
    ];
    return { problemsetList };
  }

}
