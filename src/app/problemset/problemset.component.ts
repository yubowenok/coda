import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
    private api: ApiService,
    private location: Location
  ) { }

  @Input() problemset: ProblemsetInfo;

  ngOnInit() {
    this.getProblemset();
  }

  getProblemset(): void {
    const id = this.route.snapshot.paramMap.get('problemsetId');
    this.api.getProblemset(id)
      .subscribe(problemset => {
        this.problemset = problemset;
      });
  }

}
