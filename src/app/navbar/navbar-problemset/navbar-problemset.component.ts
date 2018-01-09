import { Component, OnInit, Input } from '@angular/core';

import * as moment from 'moment';

import { ProblemsetInfo } from '../../constants/problemset';

@Component({
  selector: 'app-navbar-problemset',
  templateUrl: './navbar-problemset.component.html',
  styleUrls: ['./navbar-problemset.component.css']
})
export class NavbarProblemsetComponent implements OnInit {

  @Input() problemset: ProblemsetInfo;

  constructor() { }

  ngOnInit() {

  }

  timeToFinish(): string {
    if (this.problemset.endTime < new Date().getTime()) {
      return 'Problemset has ended';
    }
    return 'Ends ' + moment(this.problemset.endTime).fromNow();
  }

}
