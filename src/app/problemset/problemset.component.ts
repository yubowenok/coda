import { Component, OnInit, Input } from '@angular/core';
import {Router, ActivatedRoute, NavigationStart, RouterEvent } from '@angular/router';

import { ApiService } from '../api.service';

import { ProblemsetInfo } from '../constants/problemset';

@Component({
  selector: 'app-problemset',
  templateUrl: './problemset.component.html',
  styleUrls: ['./problemset.component.css']
})
export class ProblemsetComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) { }

  @Input() problemset: ProblemsetInfo;

  private error: { msg: string } | undefined;

  ngOnInit() {
    this.router.events.subscribe((data: RouterEvent) => {
      if (data instanceof NavigationStart && data.url === '/problemsets') {
        this.api.resetCurrentProblemset();
      }
    });
    this.getProblemset();
  }

  getProblemset(): void {
    const problemsetId = this.route.snapshot.paramMap.get('problemsetId');
    this.api.getProblemset(problemsetId)
      .subscribe(
        problemset => {
          this.api.setCurrentProblemset(problemset);
          this.problemset = problemset;
          this.error = undefined;

          if (!problemset.started) {
            return;
          }
          const problemNumber = this.route.snapshot.paramMap.get('problemNumber');
          if (problemNumber == null) {
            const firstProblemNumber = problemset.problems[0].number;
            this.router.navigate([`/problemset/${problemsetId}/problem/${firstProblemNumber}`], {
              replaceUrl: true
            });
          }
        },
        err => {
          this.api.loginErrorHandler(err);
          this.error = err.error;
        }
      );
  }

}
