import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';

import { SubmissionWithSource } from '../constants/submission';
import { ProblemsetInfo } from '../constants/problemset';
import { CopyService } from '../copy.service';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private copy: CopyService
  ) { }

  private problemset: ProblemsetInfo;
  private submission: SubmissionWithSource;
  private problemTitle: string;

  ngOnInit() {
    this.getSubmission();
  }

  getSubmission(): void {
    const submissionId = this.route.snapshot.paramMap.get('submissionId');
    const problemsetId = this.route.snapshot.paramMap.get('problemsetId');
    this.api.getProblemset(problemsetId)
      .subscribe(problemset => {
        this.problemset = problemset;
        this.updateTitle();
      });
    this.api.getSubmission(problemsetId, '', submissionId) // TODO: add username
      .subscribe(submission => {
        this.submission = submission;
        this.updateTitle();
      });
  }

  updateTitle(): void {
    if (!this.problemset || !this.submission) {
      return;
    }
    for (let i = 0; i < this.problemset.problems.length; i++) {
      const problem = this.problemset.problems[i];
      if (problem.number === this.submission.problemNumber) {
        this.problemTitle = `${problem.number} - ${problem.title}`;
        return;
      }
    }
  }

  getUsername(): string {
    return this.route.snapshot.paramMap.get('username');
  }

  copyText(text: string, successMessage: string): void {
    this.copy.copyText(text, successMessage);
  }

}
