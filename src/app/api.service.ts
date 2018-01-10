import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { API_URL, ProblemsetInfo, ProblemContent } from './constants';
import * as time from './constants/time';

const PROBLEMSET_REFETCH_INTERVAL = time.DAY_MS;
const PROBLEM_REFETCH_INTERVAL = time.DAY_MS;

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }

  private problemsetUrl: string = API_URL + 'problemset';
  private problemUrl: string = API_URL + 'problem';

  private problemsetCache: {
    [problemsetId: string]: {
      data: ProblemsetInfo,
      lastFetched: number
    }
  } = {};
  private problemCache: {
    [problemId: string]: {
      data: ProblemContent,
      lastFetched: number
    }
  } = {};

  getProblemsets(): Observable<ProblemsetInfo[]> {
    return this.http.get<ProblemsetInfo[]>(this.problemsetUrl)
      .pipe(
        tap(problemsets => {
          console.log('fetched problemsets', problemsets);
        }),
        catchError(this.handleError('getProblemsets', []))
      );
  }

  getProblemset(id: string): Observable<ProblemsetInfo> {
    if (id in this.problemsetCache &&
      (new Date().getTime() - this.problemsetCache[id].lastFetched) <= PROBLEMSET_REFETCH_INTERVAL) {
      return of(this.problemsetCache[id].data);
    }
    const url = `${this.problemsetUrl}/${id}`;
    return this.http.get<ProblemsetInfo>(url)
      .pipe(
        tap(problemset => {
          console.log(`fetched problemset ${id}`, problemset);
          this.problemsetCache[id] = {
            data: problemset,
            lastFetched: new Date().getTime()
          };
        }),
        catchError(this.handleError<ProblemsetInfo>(`getProblemset ${id}`))
      );
  }

  getProblem(id: string): Observable<ProblemContent> {
    if (id in this.problemCache &&
      (new Date().getTime() - this.problemCache[id].lastFetched) <= PROBLEM_REFETCH_INTERVAL) {
      return of(this.problemCache[id].data);
    }
    const url = `${this.problemUrl}/${id}`;
    return this.http.get<ProblemContent>(url)
      .pipe(
        tap(problem => {
          console.log(`fetched problem ${id}`, problem);
          this.problemCache[id] = {
            data: problem,
            lastFetched: new Date().getTime()
          };
        }),
        catchError(this.handleError<ProblemContent>(`getProblem ${id}`))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
