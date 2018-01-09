import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { API_URL, ProblemsetInfo } from './constants';

const PROBLEMSET_REFETCH_INTERVAL = 60000;

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }

  private problemsetListUrl: string = API_URL + 'problemsetList';

  private problemsetCache: {
    [problemsetId: string]: {
      data: ProblemsetInfo,
      lastFetched: number
    }
  } = {};

  getProblemsetList(): Observable<ProblemsetInfo[]> {
    return this.http.get<ProblemsetInfo[]>(this.problemsetListUrl)
      .pipe(
        tap(problemsetList => {
          console.log('fetched problemsetList', problemsetList);
        }),
        catchError(this.handleError('getProblemsetList', []))
      );
  }

  getProblemset(id: string): Observable<ProblemsetInfo> {
    if (id in this.problemsetCache &&
      (new Date().getTime() - this.problemsetCache[id].lastFetched) <= PROBLEMSET_REFETCH_INTERVAL) {
      return of(this.problemsetCache[id].data);
    }
    const url = `${this.problemsetListUrl}/${id}`;
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
