import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { MessageService } from '../message.service';

import { ProblemContent } from '../constants/problem';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.css']
})
export class ProblemComponent implements OnInit {

  constructor(
    private api: ApiService,
    private message: MessageService,
    private route: ActivatedRoute
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

  copyText(text: string, successMessage: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
  textArea.select();
    try {
      document.execCommand('copy');
      this.message.showMessage(successMessage);
    } catch (err) {
      this.message.showMessage('copy is not supported by your browser');
    }
    document.body.removeChild(textArea);
  }
}
