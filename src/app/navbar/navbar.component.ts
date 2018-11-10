import {Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';

import { ProblemsetInfo } from '../constants/problemset';
import { shouldProblemsetDisplay } from '../util';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  logoUrl = 'assets/logo.png';

  problemset: ProblemsetInfo;

  constructor(public api: ApiService) { }

  ngOnInit() {
    this.api.getCurrentProblemset()
      .subscribe(problemset => this.problemset = problemset);
  }

  hasProblemsetDisplay(): boolean {
    return shouldProblemsetDisplay(this.problemset);
  }

}
