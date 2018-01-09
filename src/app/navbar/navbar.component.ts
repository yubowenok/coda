import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { environment } from '../../environments/environment';
import { ApiService } from '../api.service';

import { ProblemsetInfo } from '../constants/problemset';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  logoUrl: string = !environment.production ? 'assets/logo.png' : 'logo.png';

  problemset: ProblemsetInfo | null = null;

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
          this.problemset = null;
        }
      }
    });
  }

  ngOnInit() {
  }

  isProblemset(): boolean {
    return this.problemset !== null;
  }

  getProblemset(id: string): void {
    this.api.getProblemset(id)
      .subscribe(problemset => console.log('got problemset in navbar', this.problemset = problemset));
  }

}
