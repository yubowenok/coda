import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router, RouterEvent, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import {catchError, distinctUntilChanged, tap} from 'rxjs/operators';
import { MessageService } from './message.service';
import {
  API_URL,
  ProblemsetInfo,
  ProblemContent,
  Scoreboard,
  Submission,
  SubmissionWithSource,
  SignupInfo,
  UserInfo,
  LoginInfo,
  UserSettings
} from './constants';
import * as time from './constants/time';

const RefetchInterval = {
  PROBLEMSET: time.HOUR_MS,
  PROBLEM: time.HOUR_MS,
  SCOREBOARD: 30 * time.SECOND_MS,
  SUBMISSION: time.HOUR_MS,
  SUBMISSION_LIST: 10 * time.SECOND_MS
};

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true
};

enum ApiType {
  PROBLEM = 'problem',
  PROBLEMSET = 'problemset',
  PROBLEMSET_LIST = 'problemsets',
  SCOREBOARD = 'scoreboard',
  SUBMISSION = 'submission',
  SUBMISSION_LIST = 'submissions',
  SIGNUP = 'signup',
  LOGIN = 'login',
  LOGOUT = 'logout',
  CHECK_LOGIN = 'check-login',
  SETTINGS = 'settings',
  UPDATE_PASSWORD = 'update-password',
  UPDATE_SETTINGS = 'update-settings'
}

@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient,
    private message: MessageService,
    private router: Router
  ) {
    this.checkLogin().subscribe();
    this.problemset = new Subject<ProblemsetInfo | undefined>();
    this.problemset$ = this.problemset;

    // Reset problemset to undefined whenever user navigates to problemsets.
    this.router.events.subscribe((evt: RouterEvent) => {
      if (evt instanceof NavigationStart && evt.url === '/problemsets') {
        this.resetCurrentProblemset();
      }
    });
  }

  private user: UserInfo;
  private problemset: Subject<ProblemsetInfo | undefined>;
  private problemset$: Observable<ProblemsetInfo | undefined>;
  public latestProblemset: ProblemsetInfo | undefined;

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
    return this.http.get<ProblemsetInfo[]>(this.url(ApiType.PROBLEMSET_LIST))
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
    const url = `${this.url(ApiType.PROBLEMSET)}/${id}`;
    return this.http.get<ProblemsetInfo>(url, httpOptions)
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

  getProblem(problemsetId: string, problemNumber: string): Observable<ProblemContent> {
    const cacheId = `${problemsetId}/${problemNumber}`;
    const cached = this.getCache(cacheId, this.problemCache, RefetchInterval.PROBLEM);
    if (cached !== null) {
      return cached;
    }
    const url = `${this.url(ApiType.PROBLEMSET)}/${problemsetId}/${ApiType.PROBLEM}/${problemNumber}`;
    return this.http.get<ProblemContent>(url, httpOptions)
      .pipe(
        tap(problem => {
          console.log(`fetched problem ${cacheId}`, problem);
          this.problemCache[cacheId] = {
            data: problem,
            lastFetched: new Date().getTime()
          };
        }),
        catchError(this.handleError<ProblemContent>(`getProblem ${cacheId}`))
      );
  }

  getScoreboard(id: string): Observable<Scoreboard> {
    const cached = this.getCache(id, this.scoreboardCache, RefetchInterval.SCOREBOARD);
    if (cached !== null) {
      return cached;
    }
    const url = `${this.url(ApiType.PROBLEMSET)}/${id}/${ApiType.SCOREBOARD}`;
    return this.http.get<Scoreboard>(url, httpOptions)
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

  getSubmission(problemsetId: string, username: string, submissionNumber: string): Observable<SubmissionWithSource> {
    const cacheId = `${problemsetId}_${username}_${submissionNumber}`;
    const cached = this.getCache(cacheId, this.submissionCache, RefetchInterval.SUBMISSION);
    if (cached !== null) {
      return cached;
    }
    const url = `${this.url(ApiType.PROBLEMSET)}/${problemsetId}/${ApiType.SUBMISSION}/${username}/${submissionNumber}`;
    return this.http.get<SubmissionWithSource>(url, httpOptions)
      .pipe(
        tap(submission => {
          console.log(`fetched submission ${problemsetId} ${submissionNumber}`, submission);
        }),
        catchError(this.handleError<SubmissionWithSource>(`getSubmission ${problemsetId} ${submissionNumber}`))
      );
  }

  getSubmissionList(problemsetId: string, username: string): Observable<Submission[]> {
    const cacheId = `${problemsetId}_${username}`;
    const cached = this.getCache(cacheId, this.submissionListCache, RefetchInterval.SUBMISSION_LIST);
    if (cached !== null) {
      return cached;
    }
    const url = `${this.url(ApiType.PROBLEMSET)}/${problemsetId}/${ApiType.SUBMISSION_LIST}/${username}`;
    return this.http.get<Submission[]>(url, httpOptions)
      .pipe(
        tap(submissions => {
          console.log(`fetched submissions ${problemsetId}`, submissions);
        }),
        catchError(this.handleError<Submission[]>(`getSubmissions ${problemsetId}`, []))
      );
  }

  signup(info: SignupInfo): Observable<UserInfo> {
    return this.http.post<UserInfo>(this.url(ApiType.SIGNUP), info, httpOptions)
      .pipe(
        tap((userInfo: UserInfo) => {
          this.user = userInfo;
        }),
        catchError(this.handleError<UserInfo>('signup'))
      );
  }

  login(info: LoginInfo): Observable<UserInfo> {
    return this.http.post<UserInfo>(this.url(ApiType.LOGIN), info, httpOptions)
      .pipe(
        tap((userInfo: UserInfo) => {
          this.user = userInfo;
        }),
        catchError(this.handleError<UserInfo>('login'))
      );
  }

  logout(): Observable<boolean> {
    return this.http.post<boolean>(this.url(ApiType.LOGOUT), {}, httpOptions)
      .pipe(
        tap(res => {
          if (res === true) {
            this.user = undefined;
          }
        }),
        catchError(this.handleError<boolean>('logout'))
      );
  }

  getCurrentUser(): UserInfo | undefined {
    return this.user ? this.user : undefined;
  }

  onProblemsetIdChange(id?: string) {
    if (id) {
      this.getProblemset(id)
        .subscribe(problemset => this.setCurrentProblemset(problemset));
    }
  }

  getCurrentProblemset(): Observable<ProblemsetInfo | undefined> {
    return this.problemset$;
  }

  setCurrentProblemset(problemset: ProblemsetInfo): void {
    this.latestProblemset = problemset;
    this.problemset.next(problemset);
  }

  resetCurrentProblemset(): void {
    this.latestProblemset = undefined;
    this.problemset.next(undefined);
  }

  updatePassword(passwords: {
    currentPassword: string,
    password: string,
    confirmPassword: string
  }): Observable<boolean> {
    return this.http.post<boolean>(this.url(ApiType.UPDATE_PASSWORD), passwords, httpOptions)
      .pipe(
        catchError(this.handleError<boolean>('updatePassword'))
      );
  }

  updateSettings(settings: UserSettings): Observable<UserSettings> {
    return this.http.post<UserSettings>(this.url(ApiType.UPDATE_SETTINGS), settings, httpOptions)
      .pipe(
        tap((serverSettings: UserSettings) => {
          Object.assign(this.user, serverSettings);
        }),
        catchError(this.handleError<UserSettings>('updateSettings'))
      );
  }

  getUserSettings(): Observable<UserSettings> {
    return this.http.get<UserSettings>(this.url(ApiType.SETTINGS), httpOptions)
      .pipe(
        tap((serverSettings: UserSettings) => {
          Object.assign(this.user, serverSettings);
        }),
        catchError(this.handleError<UserSettings>('getUserSettings'))
      );
  }

  loginErrorHandler(err: HttpErrorResponse): void {
    if (this.isRequireLogin(err)) {
      this.message.requireLogin();
    }
  }

  private isRequireLogin(err: HttpErrorResponse): boolean {
    return err.error && err.error.msg.match(/login required/);
  }

  private checkLogin(): Observable<UserInfo> {
    return this.http.post<UserInfo>(this.url(ApiType.CHECK_LOGIN), {}, httpOptions)
      .pipe(
        tap((info: UserInfo) => {
          this.user = info;
        })
      );
  }

  private url(type: ApiType) {
    return API_URL + type;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (res: any): Observable<T> => {
      // display error if there is a msg field
      if (res.error && res.error.msg) {
        console.error(res.error.msg);
      }
      // We have provided a default value. Use the default value and log error.
      if (result !== undefined) {
        return of(result as T);
      }
      return ErrorObservable.create(res);
    };
  }
}
