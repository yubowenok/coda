import { Component, OnInit } from '@angular/core';
import { ProblemsetInfo } from '../constants/problemset';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';

import { Language } from '../constants/language';
import { SubtaskInfo } from '../constants/problem';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css']
})
export class SubmitComponent implements OnInit {

  constructor(
    private api: ApiService,
    private route: ActivatedRoute
  ) { }

  private problemset: ProblemsetInfo;
  private selectedProblem = '';
  private lockProblemSelect = false;
  private selectedSubtask = '';
  private subtasks: SubtaskInfo[] = [];

  private language: Language = Language.UNKNOWN;

  private code$;
  private code = new Subject<string>();
  private displayCode = '(Paste your source code here)\n\n';
  private latestCode = this.displayCode;

  ngOnInit() {
    this.getProblemset();
    this.getSelectedProblem();

    /*
    this.code$ = this.code.pipe(
      debounceTime(3000),
      distinctUntilChanged(),
      switchMap((code: string) => of(code))
    );
    this.code$.subscribe((code: string) => {
      this.displayCode = code;
    });
    */
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
    // this.code.next(code);
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
      .subscribe(problemset => {
        this.problemset = problemset;
        this.getSubtasks();
      });
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

  }

}
