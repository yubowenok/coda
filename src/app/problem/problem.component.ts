import { Component, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { CopyService } from '../copy.service';

import { ProblemContent } from '../constants/problem';
import { HttpErrorResponse } from '@angular/common/http';

const LINE_HEIGHT = 14 * 1.5; // font-size * line-height

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
  private errored = false;

  ngOnInit() {
    this.route.params.subscribe((params: { problemsetId: string, problemNumber: string }) => {
      this.getProblem(params.problemsetId, params.problemNumber);
    });
  }

  getProblem(problemsetId: string, problemNumber: string): void {
    this.api.getProblem(problemsetId, problemNumber)
      .subscribe(
        (problem: ProblemContent) => {
          this.problem = problem;
          this.errored = false;
        },
        (err: HttpErrorResponse) => {
          this.errored = true;
        }
      );
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

  getSampleHeight(sample: { in: string, out: string }): Object {
    const inLines = sample.in.split(/\n/).length;
    const outLines = sample.out.split(/\n/).length;
    // minus one to remove empty string after last newline
    const height = (Math.max(inLines, outLines) - 1) * LINE_HEIGHT;
    return { height: `${height}px` };
  }

}
