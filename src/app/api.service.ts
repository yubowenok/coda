import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import {
  API_URL,
  ProblemsetInfo,
  ProblemContent,
  Scoreboard,
  Submission,
  SubmissionWithSource
} from './constants';
import * as time from './constants/time';

const RefetchInterval = {
  PROBLEMSET: time.HOUR_MS,
  PROBLEM: time.HOUR_MS,
  SCOREBOARD: 30 * time.SECOND_MS,
  SUBMISSION: time.HOUR_MS,
  SUBMISSION_LIST: 10 * time.SECOND_MS
};

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }

  private problemsetUrl: string = API_URL + 'problemset';
  private problemUrl: string = API_URL + 'problem';
  private scoreboardUrl: string = API_URL + 'scoreboard';
  private submissionUrl: string = API_URL + 'submission';

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
  private scoreboardCache: {
    [problemsetId: string]: {
      data: Scoreboard,
      lastFetched: number
    }
  } = {};
  private submissionCache: {
    [id: string]: {
      data: SubmissionWithSource,
      lastFetched: number
    }
  } = {};
  private submissionListCache: {
    [id: string]: {
      data: Submission[],
      lastFetched: number
    }
  } = {};

  getCache(id: string, cache: { [id: string]: { data: any, lastFetched: number }},
           refetchInterval: number): Observable<any> | null {
    if (id in cache && (new Date().getTime() - cache[id].lastFetched) <= refetchInterval) {
      return of(cache[id].data);
    }
    return null;
  }

  getProblemsetList(): Observable<ProblemsetInfo[]> {
    return this.http.get<ProblemsetInfo[]>(this.problemsetUrl)
      .pipe(
        tap(problemsets => {
          console.log('fetched problemset list', problemsets);
        }),
        catchError(this.handleError('getProblemsetList', []))
      );
  }

  getProblemset(id: string): Observable<ProblemsetInfo> {
    const cached = this.getCache(id, this.problemsetCache, RefetchInterval.PROBLEMSET);
    if (cached !== null) {
      return cached;
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
    const cached = this.getCache(id, this.problemCache, RefetchInterval.PROBLEM);
    if (cached !== null) {
      return cached;
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

  getScoreboard(id: string): Observable<Scoreboard> {
    const cached = this.getCache(id, this.scoreboardCache, RefetchInterval.SCOREBOARD);
    if (cached !== null) {
      return cached;
    }
    const url = `${this.scoreboardUrl}/${id}`;
    return this.http.get<Scoreboard>(url)
      .pipe(
        tap(scoreboard => {
          console.log(`fetched scoreboard ${id}`, scoreboard);
          this.scoreboardCache[id] = {
            data: scoreboard,
            lastFetched: new Date().getTime()
          };
        }),
        catchError(this.handleError<Scoreboard>(`getScoreboard ${id}`))
      );
  }

  getSubmission(problemsetId: string, username: string, submissionId: string): Observable<SubmissionWithSource> {
    const cacheId = `${problemsetId}_${username}_${submissionId}`;
    const cached = this.getCache(cacheId, this.submissionCache, RefetchInterval.SUBMISSION);
    if (cached !== null) {
      return cached;
    }
    const url = `${this.submissionUrl}/${submissionId}`; // TODO: add problemsetId arg to API url
    return this.http.get<SubmissionWithSource>(url)
      .pipe(
        tap(submission => {
          console.log(`fetched submission ${problemsetId} ${submissionId}`, submission);
        }),
        catchError(this.handleError<SubmissionWithSource>(`getSubmission ${problemsetId} ${submissionId}`))
      );
  }

  getSubmissionList(problemsetId: string, username: string): Observable<Submission[]> {
    const cacheId = `${problemsetId}_${username}`;
    const cached = this.getCache(cacheId, this.submissionListCache, RefetchInterval.SUBMISSION_LIST);
    if (cached !== null) {
      return cached;
    }
    const url = `${this.submissionUrl}`; // TODO add problemsetId arg to API url
    return this.http.get<Submission[]>(url)
      .pipe(
        tap(submissions => {
          console.log(`fetched submissions ${problemsetId}`, submissions);
        }),
        catchError(this.handleError<Submission[]>(`getSubmissions ${problemsetId}`, []))
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