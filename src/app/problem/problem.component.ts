import { Component, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { CopyService } from '../copy.service';

import { ProblemContent } from '../constants/problem';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.css']
})
export class ProblemComponent implements OnInit {

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private copy: CopyService
  ) { }

  private problem: ProblemContent;

  ngOnInit() {
    this.route.params.subscribe((params: { problemsetId: string, problemNumber: string }) => {
      this.problem = undefined;
      this.getProblem(`${params.problemsetId}_${params.problemNumber}`);
    });
  }

  getProblem(id: string): void {
    this.api.getProblem(id)
      .subscribe(problem => {
        this.problem = problem;
      });
  }

  displaySubtaskOnlySample(sample: { id: string }): string {
    const specialSamples = this.problem.subtaskOnlySamples;
    let res = '';
    for (let i = 0; i < specialSamples.length; i++) {
      if (sample.id === specialSamples[i].sample) {
        res = `(${specialSamples[i].subtasks
          .map((s) => new TitleCasePipe().transform(s)).join(', ')} subtasks)`;
      }
    }
    return res;
  }

  copyText(text: string, successMessage: string): void {
    this.copy.copyText(text, successMessage);
  }

}
