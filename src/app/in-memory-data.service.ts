import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

import { RunMode, JudgeMode, PenaltyMode } from './constants/problemset';

import * as moment from 'moment';
import * as time from './constants/time';

@Injectable()
export class InMemoryDataService implements InMemoryDbService {

  constructor() { }

  getStartTime(): number {
    return (new Date()).getTime() +
      Math.floor((-Math.random() * time.DAY_MS * 7 + 2 * time.DAY_MS)); // [-5, 2] days
  }

  getEndTime(startTime: number) {
    return startTime + 7 * time.DAY_MS; // length is 7 days
  }

  getStartEndTime() {
    const startTime = this.getStartTime();
    const endTime = this.getEndTime(startTime);
    return { startTime, endTime };
  }

  createDb() {
    const problemInfoList = [
      {
        number: 'A',
        id: 'aplusb',
        title: 'A Plus B',
        subtasks: [
          { id: 'small', score: 20 },
          { id: 'large', score: 40 }
        ]
      },
      {
        number: 'B',
        id: 'gradecurving',
        title: 'Grade Curving',
        subtasks: [
          { id: 'small', score: 20 },
          { id: 'large', score: 40 }
        ]
      },
      {
        number: 'C',
        id: 'maxexpression',
        title: 'Maximum Expression',
        subtasks: [
          { id: 'small', score: 20 },
          { id: 'large', score: 30 }
        ]
      },
      {
        number: 'D',
        id: 'ultimate',
        title: 'Ultimate Challenge',
        subtasks: [
          { id: 'small', score: 20 },
          { id: 'medium', score: 30 },
          { id: 'large', score: 50 }
        ]
      }
    ];
    const problemset = [
      {
        id: 'set1',
        title: 'Test Problemset 1',
        startTime: this.getStartTime(),
        runMode: RunMode.STANDARD,
        judgeMode: JudgeMode.OPEN,
        penaltyMode: PenaltyMode.SCORE,
        ...this.getStartEndTime(),
        problems: problemInfoList
      },
      {
        id: 'set2',
        title: 'Test Problemset 2',
        runMode: RunMode.SELFTEST,
        judgeMode: JudgeMode.BLIND,
        penaltyMode: PenaltyMode.TIME,
        ...this.getStartEndTime(),
        problems: problemInfoList
      },
      {
        id: 'set3',
        title: 'Test Problemset 3',
        runMode: RunMode.STANDARD,
        judgeMode: JudgeMode.OPEN,
        penaltyMode: PenaltyMode.SCORE,
        ...this.getStartEndTime(),
        problems: problemInfoList
      }
    ];

    const problem = [
      {
        id: 'set1_A',
        title: 'A Plus B',
        timeLimit: 1,
        statement: '$a + b = c$',
        subtasks: [
          {
            id: 'small',
            score: 20,
            text: '$N\\leq50$'
          },
          {
            id: 'large',
            score: 40,
            text: 'Original constraints'
          }
        ],
        samples: [
          {
            id: 'sample-1',
            in: '1 2\n',
            out: '3\n'
          },
          {
            id: 'sample-2',
            in: '3 -2\n',
            out: '1\n'
          }
        ],
        subtaskOnlySamples: [
          { sample: 'sample-2', subtask: 'large' }
        ]
      },
      {
        id: 'set1_B',
        title: 'Grade Curving',
      },
      {
        id: 'set1_C',
        title: 'Maximum Expression',
      },
      {
        id: 'set1_D',
        title: 'Ultimate Challenge',
      }
    ];
    for (let i = 0; i < 8; i++) {
      problem.push(Object.assign({}, problem[i % 4]));
    }
    for (let i = 0; i < 4; i++) {
      problem[i + 4].id = problem[i + 4].id.replace(/1/g, '2');
      problem[i + 8].id = problem[i + 8].id.replace(/1/g, '3');
    }

    return { problemset, problem };
  }

}
