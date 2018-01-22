import { Component, OnInit } from '@angular/core';
import { ProblemsetInfo } from '../constants/problemset';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';

import { Language } from '../constants/language';
import { SubtaskInfo } from '../constants/problem';
import { CopyService } from '../copy.service';
import { MessageService } from '../message.service';
import { SubmitData } from '../constants/submission';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css']
})
export class SubmitComponent implements OnInit {

  constructor(
    private api: ApiService,
    private copy: CopyService,
    private message: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  problemset: ProblemsetInfo;
  error: { msg: string } | undefined;

  private selectedProblem = '';
  private lockProblemSelect = false;
  private selectedSubtask = '';
  private subtasks: SubtaskInfo[] = [];
  private language: Language = Language.UNKNOWN;
  private displayCode = '';
  private latestCode = this.displayCode;

  ngOnInit() {
    this.route.params.subscribe((params: { problemsetId: string, problemNumber: string }) => {
      this.api.changeProblemsetId(params.problemsetId);
    });

    this.getProblemset();
  }

  selectedProblemHasSubtask(): boolean {
    if (!this.selectedProblem) {
      return false;
    }
    return this.subtasks.length > 1;
  }

  onProblemChange(problemNumber: string) {
    this.getSubtasks();
    this.selectedSubtask = '';
  }

  onLanguageChange(language: string) {
    this.displayCode = this.latestCode;
  }

  onCodeChange(code: string) {
    this.latestCode = code;
  }

  getSelectedProblem(): void {
    const problemNumber = this.route.snapshot.paramMap.get('problemNumber');
    if (problemNumber != null) {
      this.selectedProblem = problemNumber;
      this.lockProblemSelect = true;
    }
  }

  getProblemset(): void {
    const problemsetId = this.route.snapshot.paramMap.get('problemsetId');
    this.api.getProblemset(problemsetId)
      .subscribe(
        problemset => {
          this.problemset = problemset;
          this.getSelectedProblem();
          this.getSubtasks();
        },
        err => {
          this.api.loginErrorHandler(err);
          this.error = err.error;
        }
      );
  }

  getSubtasks(): void {
    if (!this.problemset) {
      return;
    }
    for (let i = 0; i < this.problemset.problems.length; i++) {
      if (this.problemset.problems[i].number === this.selectedProblem) {
        this.subtasks = this.problemset.problems[i].subtasks;
        return;
      }
    }
  }

  submittable(): boolean  {
    return this.selectedProblem &&
      (!this.selectedProblemHasSubtask() || this.selectedSubtask) &&
      this.language !== Language.UNKNOWN &&
      this.latestCode !== '';
  }

  submit() {
    const data: SubmitData = {
      username: this.api.getCurrentUser().username,
      problemsetId: this.problemset.id,
      problemNumber: this.selectedProblem,
      subtask: this.selectedSubtask || 'all',
      language: this.language,
      sourceCode: this.latestCode
    };
    this.api.submit(data)
      .subscribe(
        (submissionNumber: number) => {
          this.message.info(`Solution #${submissionNumber} submitted!`);
          this.router.navigate(
            [`/problemset/${data.problemsetId}/submission/${data.username}/${submissionNumber}`]);
        },
        err => {
          this.message.error(err.error.msg);
        }
      );
  }

  copyText(text: string): void {
    this.copy.copyText(text, 'Source code copied');
  }

}
