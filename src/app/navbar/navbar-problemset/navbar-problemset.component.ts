import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import * as moment from 'moment';

import { ProblemsetInfo, RunMode } from '../../constants/problemset';
import * as time from '../../constants/time';

@Component({
  selector: 'app-navbar-problemset',
  templateUrl: './navbar-problemset.component.html',
  styleUrls: ['./navbar-problemset.component.css']
})
export class NavbarProblemsetComponent implements OnInit, OnDestroy {

  @Input() problemset: ProblemsetInfo;

  constructor() { }

  private timeRemaining = '';
  private timeTillStart = '';
  private timePassedPercent = 0;

  private interval: number;

  ngOnInit() {
    this.interval = setInterval(this.getTimes.bind(this), time.SECOND_MS);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  hasStarted(): boolean {
    // TODO: replace this by checking problemset.started
    if (this.problemset.runMode === RunMode.SELFTEST) {
      console.error('hasStarted is not implemented for SELFTEST');
      return false;
    }
    return this.problemset.startTime < new Date().getTime();
  }

  getTimes(): void {
    if (this.hasStarted()) {
      if (this.problemset.runMode === RunMode.SELFTEST) {
        this.getSelftestTimeRemaining();
      } else {
        this.getStandardTimeRemaining();
      }
    } else { // not started yet
      if (this.problemset.runMode === RunMode.SELFTEST) {
        this.timeTillStart = 'You have not started the selftest.';
      } else {
        this.getStandardTimeTillStart();
      }
    }
  }

  getStandardTimeTillStart(): void {
    const now: moment.Moment = moment();
    const start: moment.Moment = moment(this.problemset.startTime);
    this.timeTillStart = this.displayTime(start.diff(now));
  }

  getStandardTimeRemaining(): void {
    if (this.problemset.endTime < new Date().getTime()) {
      this.timeRemaining = 'Problemset has ended';
      this.timePassedPercent = 100;
      return;
    }
    const now: moment.Moment = moment();
    const end: moment.Moment = moment(this.problemset.endTime);
    const total = this.problemset.endTime - this.problemset.startTime;
    this.timeRemaining = this.displayTime(end.diff(now));
    this.timePassedPercent = (1 - end.diff(now) / total) * 100;
  }

  getSelftestTimeRemaining(): void {
    console.error('getSelftestTimeRemaining is not implemented');
  }

  displayTime(t: number): string {
    const days = Math.floor(t / time.DAY_MS);
    const hours = Math.floor(t % time.DAY_MS / time.HOUR_MS);
    let minutes: number | string = Math.floor(t % time.HOUR_MS / time.MINUTE_MS);
    let seconds: number | string = Math.floor(t % time.MINUTE_MS / time.SECOND_MS);
    if (minutes && minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (seconds && seconds < 10) {
      seconds = `0${seconds}`;
    }
    return `${days ? days + 'd ' : ''} ` +
      `${hours ? hours + 'h' : ''}${minutes ? minutes + 'm' : ''}${seconds ? seconds + 's' : ''}`;
  }

}
