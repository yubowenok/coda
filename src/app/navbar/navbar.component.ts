import {Component, OnInit, HostListener } from '@angular/core';
import { environment } from '../../environments/environment';
import * as Cookies from 'cookies-js';
import { ApiService } from '../api.service';

import * as time from '../constants/time';
import { ProblemsetInfo } from '../constants/problemset';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  logoUrl = 'assets/logo.png';

  problemset: ProblemsetInfo;

  public linksExpanded = true;

  constructor(
    public api: ApiService
  ) {
    this.api.getCurrentProblemset()
      .subscribe(problemset => this.problemset = problemset);
  }

  @HostListener('window:beforeunload', ['$event'])
  public beforeWindowUnload($event: BeforeUnloadEvent) {
    this.saveLinksExpanded();
  }

  ngOnInit() {
    if (Cookies.get('linksExpanded') !== undefined) {
      this.linksExpanded = Cookies.get('linksExpanded');
    }
  }

  saveLinksExpanded() {
    Cookies.set('linksExpanded', this.linksExpanded, {
      expires: time.DAY_MS * 7 / time.SECOND_MS
    });
  }

}
