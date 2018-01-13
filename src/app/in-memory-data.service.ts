import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

import {
  RunMode,
  JudgeMode,
  PenaltyMode,
  Scoreboard,
  ParticipantScore,
  SubmissionWithSource,
  Submission,
  Verdict,
  Language
} from './constants';

import * as time from './constants/time';

const testStatement = `<div class="section">
  <p>
    We have learned <it>Longest Increasing Subsequence</it> (LIS) <tt>in the course</tt>.
    Recall that LIS$(S)$ of a sequence $S$ is the longest <it>strictly</it> increasing sequence you can obtain from $S$
    by removing some (possibly none) elements from $S$.
  </p>
  <p>
    We say an element of $S$ is <it>critical</it>, if removing it will 'cause' the length of LIS$(S)$ to decrease.
    For example, in the sequence $S = [1, 3, 2, 4]$, LIS$(S)$ has length $3$.
    The element $1$ is critical, because removing it gives the sequence $[3, 2, 4]$ and its LIS has length $2$.
    The element $2$ is not critical,
    because removing it gives the sequence $[1, 3, 4]$ and its LIS is still of length $3$.
  </p>
  <p>
    Given a sequence $S$ that is a permutation of integers from $1$ to $N$, find which of its elements are critical.
  </p>
</div>
<div class="section">
<h3>Input</h3>
  <p>
    The first line of the input has an integer $T$ ($1 \\leq T\\leq 30$), the number of test cases.<br>
    Each case has an integer $N$ on the first line.<br>
    The next line has $N$ integers, giving the permutation $S$.
  </p>
</div>
<div class="section">
  <h3>Output</h3>
  <p>
    For each sequence output its critical elements in ascending order, separated by single spaces. If none of the
    elements are critical, output "<tt>-1</tt>".
  </p>
</div>
<div class="section">
  <h3>Constraints</h3>
  <ul>
    <li>$1 \\leq N \\leq 10^5$</li>
    <li>Each integer from $1$ to $N$ appears exactly once in the sequence
    ($S$ is a permutation of integers from $1$ to $N$).</li>
  </ul>
</div>`;

const testSource = `#include <iostream>

using namespace std;

int main() {
  int a, b;
  cin >> a >> b;
  cout << a + b << endl;
  return 0;
}`;

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
        id: 'critical',
        title: 'Critical Elements',
        subtasks: [
          { id: 'small', score: 15 },
          { id: 'medium', score: 25 },
          { id: 'large', score: 60 }
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
        title: 'Critical Elements',
        timeLimit: 1,
        statement: testStatement,
        subtasks: [
          {
            id: 'small',
            score: 15,
            text: '$N \\leq 50$'
          },
          {
            id: 'medium',
            score: 25,
            text: '$N \\leq 2\\,000$'
          },
          {
            id: 'large',
            score: 60,
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
          },
          {
            id: 'sample-3',
            in: '100 100\n',
            out: '200\n'
          }
        ],
        subtaskOnlySamples: [
          { sample: 'sample-2', subtasks: ['medium', 'large'] },
          { sample: 'sample-3', subtasks: ['large'] }
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

    const scoreboard: Scoreboard[] = [
      {
        id: 'set1',
        participants: [
          {
            name: 'john',
            score: 127,
            finishTime: 1250,
            problems: {
              A: {
                small: {
                  solved: true,
                  score: 20,
                  attempts: 1,
                  time: 420
                },
                large: {
                  solved: true,
                  score: 28,
                  attempts: 2,
                  time: 1250
                }
              },
              B: {
                small: {
                  solved: false,
                  score: 0,
                  attempts: 3,
                  time: 300
                }
              },
              C: {
                small: {
                  attempts: 2,
                  score: 33,
                  time: 250
                }
              },
              D: {
                large: {
                  solved: false,
                  attempts: 1,
                  time: 999
                }
              }
            }
          },
          {
            name: 'mary',
            score: 80,
            finishTime: 4123,
            problems: {
              A: {
                small: {
                  solved: true,
                  score: 20,
                  attempts: 2,
                  time: 570
                }
              },
              C: {
                small: {
                  solved: true,
                  score: 60,
                  attempts: 1,
                  time: 3933
                }
              }
            }
          }
        ]
      }
    ];
    for (let i = 0; i < 5; i++) {
      const participant: ParticipantScore = Object.assign({}, scoreboard[0].participants[0]);
      participant.name += Math.floor(Math.random() * 100);
      participant.score += Math.floor(Math.random() * 50);
      participant.finishTime += Math.floor(Math.random() * 50);
      scoreboard[0].participants.push(participant);
    }

    const submission: SubmissionWithSource[] = [
      {
        id: '1',
        problemNumber: 'A',
        subtask: 'small',
        verdict: Verdict.AC,
        language: Language.CPP,
        submitTime: new Date().getTime(),
        problemsetTime: 3000,
        outsideProblemsetTime: false,
        source: testSource
      },
      {
        id: '2',
        problemNumber: 'A',
        subtask: 'large',
        verdict: Verdict.AC,
        language: Language.CPP,
        submitTime: new Date().getTime(),
        problemsetTime: 4000,
        outsideProblemsetTime: false,
        source: testSource
      },
      {
        id: '3',
        problemNumber: 'A',
        subtask: 'small',
        verdict: Verdict.WA,
        language: Language.CPP,
        submitTime: new Date().getTime(),
        problemsetTime: 5000,
        outsideProblemsetTime: false,
        source: testSource
      },
      {
        id: '4',
        problemNumber: 'B',
        subtask: 'small',
        verdict: Verdict.AC,
        language: Language.JAVA,
        submitTime: new Date().getTime(),
        problemsetTime: 1000,
        outsideProblemsetTime: false,
        source: testSource
      },
      {
        id: '5',
        problemNumber: 'B',
        subtask: 'large',
        verdict: Verdict.TLE,
        language: Language.JAVA,
        submitTime: new Date().getTime(),
        problemsetTime: 10000,
        outsideProblemsetTime: true,
        source: testSource
      }
    ];

    return { problemset, problem, scoreboard, submission };
  }

}
