import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ApiService } from '../api.service';

import { ProblemsetInfo } from '../constants/problemset';

@Component({
  selector: 'app-problemset',
  templateUrl: './problemset.component.html',
  styleUrls: ['./problemset.component.css']
})
export class ProblemsetComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) { }

  @Input() problemset: ProblemsetInfo;

  error: { msg: string } | undefined;

  private currentProblemSubscription: Subscription;

  ngOnInit() {
    this.getProblemset();

    this.currentProblemSubscription = this.api.getCurrentProblemset()
      .subscribe(problemset => {
        if (problemset === undefined) {
          return;
        }
        this.loadProblemset(problemset);
      });
  }

  ngOnDestroy() {
    this.currentProblemSubscription.unsubscribe();
  }

  getProblemset(): void {
    const problemsetId = this.route.snapshot.paramMap.get('problemsetId');
    this.api.getProblemset(problemsetId)
      .subscribe(
        problemset => {
          this.api.setCurrentProblemset(problemset);
          this.loadProblemset(problemset);
        },
        err => {
          this.api.loginErrorHandler(err);
          this.error = err.error;
        }
      );
  }

  loadProblemset(problemset: ProblemsetInfo): void {
    this.problemset = problemset;
    this.error = undefined;

    if (!problemset.started) {
      this.error = { msg: 'Problemset has not started' };
      return;
    }
    const problemNumber = this.route.snapshot.paramMap.get('problemNumber');
    if (problemNumber == null) {
      const firstProblemNumber = problemset.problems[0].number;
      this.router.navigate([`/problemset/${problemset.id}/problem/${firstProblemNumber}`], {
        replaceUrl: true
      });
    }
  }

}
