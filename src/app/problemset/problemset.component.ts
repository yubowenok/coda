import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

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
    private api: ApiService,
    private location: Location
  ) { }

  @Input() problemset: ProblemsetInfo;

  ngOnInit() {
    this.getProblemset();
  }

  getProblemset(): void {
    const problemsetId = this.route.snapshot.paramMap.get('problemsetId');
    this.api.getProblemset(problemsetId)
      .subscribe(problemset => {
        this.problemset = problemset;
        if (!problemset.started) {
          return;
        }
        const problemNumber = this.route.snapshot.paramMap.get('problemNumber');
        if (problemNumber == null) {
          const firstProblemNumber = problemset.problems[0].number;
          this.router.navigate([`/problemset/${problemsetId}/problem/${firstProblemNumber}`]);
        }
      });
  }

}
