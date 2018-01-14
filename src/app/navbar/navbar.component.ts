import {Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
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

  logoUrl: string = !environment.production ? 'assets/logo.png' : 'logo.png';

  problemset: ProblemsetInfo | undefined = undefined;

  public linksExpanded = true;

  constructor(
    private api: ApiService,
    private router: Router
  ) {
    this.router.events.subscribe(data => {
      if (data instanceof ActivationEnd) {
        const problemsetId: string | undefined = data.snapshot.params.problemsetId;
        if (problemsetId) {
          this.getProblemset(problemsetId);
        } else {
          this.problemset = undefined;
        }
      }
    });
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

  getProblemset(id: string): void {
    this.api.getProblemset(id)
      .subscribe(problemset => this.problemset = problemset);
  }

  getUser(): string {
    return 'by123';
  }
}