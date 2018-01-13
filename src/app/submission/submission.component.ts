import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';

import { SubmissionWithSource } from '../constants/submission';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {

  constructor(
    private api: ApiService,
    private route: ActivatedRoute
  ) { }

  private submission: SubmissionWithSource;

  ngOnInit() {
  }

  getSubmission(): void {
    const submissionId = this.route.snapshot.paramMap.get('submissionId');
    const problemsetId = this.route.snapshot.paramMap.get('problemsetId');
    this.api.getSubmission(problemsetId, '', submissionId) // TODO: add username
      .subscribe(submission => this.submission = submission);
  }

}
