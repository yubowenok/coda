import {Component, OnInit, HostListener } from '@angular/core';
import * as Cookies from 'cookies-js';
import { ApiService } from '../api.service';

import * as time from '../constants/time';
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

  public linksExpanded = true;

  constructor(public api: ApiService) { }

  @HostListener('window:beforeunload', ['$event'])
  public beforeWindowUnload($event: BeforeUnloadEvent) {
    this.saveLinksExpanded();
  }

  ngOnInit() {
    this.api.getCurrentProblemset()
      .subscribe(problemset => this.problemset = problemset);

    if (Cookies.get('linksExpanded') !== undefined) {
      this.linksExpanded = Cookies.get('linksExpanded');
    }
  }

  saveLinksExpanded(): void {
    Cookies.set('linksExpanded', this.linksExpanded, {
      expires: time.DAY_MS * 7 / time.SECOND_MS
    });
  }

  hasProblemsetDisplay(): boolean {
    return shouldProblemsetDisplay(this.problemset);
  }

}
