import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router, RouterEvent, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import { catchError, tap } from 'rxjs/operators';
import * as Cookies from 'cookies-js';

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
  UserSettings,
  SubmitData
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

class ApiUrl {

  private static base = (url: string): string => `${API_URL}${url}`;

  static login = () => ApiUrl.base('/login');
  static loginSwitch = () => ApiUrl.base('/login-switch');
  static checkLogin = () => ApiUrl.base('/check-login');
  static logout = () => ApiUrl.base('/logout');
  static signup = () => ApiUrl.base('/signup');
  static settings = () => ApiUrl.base('/settings');
  static updatePassword = () => ApiUrl.base('/update-password');
  static updateSettings = () => ApiUrl.base('/update-settings');
  static problemsetList = () => ApiUrl.base('/problemsets');
  static problemset = (problemsetId: string) => ApiUrl.base(`/problemset/${problemsetId}`);
  static problem = (problemsetId: string, problemNumber: string) =>
    `${ApiUrl.problemset(problemsetId)}/problem/${problemNumber}`
  static submission = (problemsetId: string, username: string, submissionNumber: number) =>
    `${ApiUrl.problemset(problemsetId)}/submission/${username}/${submissionNumber}`
  static submissionList = (problemsetId: string, username: string) =>
    `${ApiUrl.problemset(problemsetId)}/submissions/${username}`
  static scoreboard = (problemsetId: string) =>
    `${ApiUrl.problemset(problemsetId)}/scoreboard`
  static queue = (problemsetId: string) =>
    `${ApiUrl.problemset(problemsetId)}/queue`
  static submit = (problemsetId: string, problemNumber: string, subtask: string) =>
    `${ApiUrl.problem(problemsetId, problemNumber)}/submit/${subtask}`

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

  clearCache(): void {
    this.problemsetCache = {};
    this.problemCache = {};
    this.scoreboardCache = {};
    this.submissionCache = {};
    this.submissionListCache = {};
  }

  getCache(id: string, cache: { [id: string]: { data: any, lastFetched: number }},
           refetchInterval: number): Observable<any> | null {
    if (id in cache && (new Date().getTime() - cache[id].lastFetched) <= refetchInterval) {
      return of(cache[id].data);
    }
    return null;
  }

  getProblemsetList(): Observable<ProblemsetInfo[]> {
    return this.http.get<ProblemsetInfo[]>(ApiUrl.problemsetList(), httpOptions)
      .pipe(
        catchError(this.handleError('getProblemsetList', []))
      );
  }

  getProblemset(id: string, noCache?: boolean): Observable<ProblemsetInfo> {
    const cached = this.getCache(id, this.problemsetCache, RefetchInterval.PROBLEMSET);
    if (noCache !== true && cached !== null) {
      return cached;
    }
    return this.http.get<ProblemsetInfo>(ApiUrl.problemset(id), httpOptions)
      .pipe(
        tap(problemset => {
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
    return this.http.get<ProblemContent>(ApiUrl.problem(problemsetId, problemNumber), httpOptions)
      .pipe(
        tap(problem => {
          this.problemCache[cacheId] = {
            data: problem,
            lastFetched: new Date().getTime()
          };
        }),
        catchError(this.handleError<ProblemContent>(`getProblem ${cacheId}`))
      );
  }

  getScoreboard(problemsetId: string): Observable<Scoreboard> {
    const cached = this.getCache(problemsetId, this.scoreboardCache, RefetchInterval.SCOREBOARD);
    if (cached !== null) {
      return cached;
    }
    return this.http.get<Scoreboard>(ApiUrl.scoreboard(problemsetId), httpOptions)
      .pipe(
        tap(scoreboard => {
          this.scoreboardCache[problemsetId] = {
            data: scoreboard,
            lastFetched: new Date().getTime()
          };
        }),
        catchError(this.handleError<Scoreboard>(`getScoreboard ${problemsetId}`))
      );
  }

  getSubmission(problemsetId: string, username: string, submissionNumber: number): Observable<SubmissionWithSource> {
    const cacheId = `${problemsetId}_${username}_${submissionNumber}`;
    const cached = this.getCache(cacheId, this.submissionCache, RefetchInterval.SUBMISSION);
    if (cached !== null) {
      return cached;
    }
    return this.http.get<SubmissionWithSource>(ApiUrl.submission(problemsetId, username, submissionNumber), httpOptions)
      .pipe(
        catchError(this.handleError<SubmissionWithSource>(`getSubmission ${problemsetId} ${submissionNumber}`))
      );
  }

  getSubmissionList(problemsetId: string, username: string): Observable<Submission[]> {
    const cacheId = `${problemsetId}_${username}`;
    const cached = this.getCache(cacheId, this.submissionListCache, RefetchInterval.SUBMISSION_LIST);
    if (cached !== null) {
      return cached;
    }
    return this.http.get<Submission[]>(ApiUrl.submissionList(problemsetId, username), httpOptions)
      .pipe(
        catchError(this.handleError<Submission[]>(`getSubmissions ${problemsetId}`))
      );
  }

  getQueue(problemsetId: string): Observable<Submission[]> {
    return this.http.get<Submission[]>(ApiUrl.queue(problemsetId), httpOptions)
      .pipe(
        catchError(this.handleError<Submission[]>(`getQueue ${problemsetId}`))
      );
  }

  submit(data: SubmitData): Observable<number> {
    return this.http.post<number>(ApiUrl.submit(data.problemsetId, data.problemNumber, data.subtask), data,
      httpOptions)
      .pipe(
        catchError(this.handleError<number>('submit'))
      );
  }

  signup(info: SignupInfo): Observable<UserInfo> {
    return this.http.post<UserInfo>(ApiUrl.signup(), info, httpOptions)
      .pipe(
        tap((userInfo: UserInfo) => {
          Cookies.set('lastUser', JSON.stringify(userInfo));
          this.user = userInfo;
        }),
        catchError(this.handleError<UserInfo>('signup'))
      );
  }

  login(info: LoginInfo): Observable<UserInfo> {
    return this.http.post<UserInfo>(ApiUrl.login(), info, httpOptions)
      .pipe(
        tap((userInfo: UserInfo) => {
          Cookies.set('lastUser', JSON.stringify(userInfo));
          this.user = userInfo;
        }),
        catchError(this.handleError<UserInfo>('login'))
      );
  }

  loginSwitch(username: string, lastUsername: string): Observable<boolean> {
    return this.http.post<boolean>(ApiUrl.loginSwitch(), { username, lastUsername }, httpOptions);
  }

  logout(): Observable<boolean> {
    return this.http.post<boolean>(ApiUrl.logout(), {}, httpOptions)
      .pipe(
        tap(res => {
          if (res === true) {
            this.user = undefined;
            this.clearCache();
            this.router.navigate(['/problemsets']);
            this.message.info('logged out');
          }
        }),
        catchError(this.handleError<boolean>('logout'))
      );
  }

  imageUrl(problemsetId: string, problemNumber: string, filename: string): string {
    return `${API_URL}/image/${problemsetId}/${problemNumber}/${filename}`;
  }

  getCurrentUser(): UserInfo | undefined {
    return this.user ? this.user : undefined;
  }

  changeProblemsetId(id?: string) {
    if (id) {
      if (this.latestProblemset !== undefined && this.latestProblemset.id === id) {
        return; // do not fire if problemset id doesn't change
      }
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
    return this.http.post<boolean>(ApiUrl.updatePassword(), passwords, httpOptions)
      .pipe(
        catchError(this.handleError<boolean>('updatePassword'))
      );
  }

  updateSettings(settings: UserSettings): Observable<UserSettings> {
    return this.http.post<UserSettings>(ApiUrl.updateSettings(), settings, httpOptions)
      .pipe(
        tap((serverSettings: UserSettings) => {
          Object.assign(this.user, serverSettings);
        }),
        catchError(this.handleError<UserSettings>('updateSettings'))
      );
  }

  getUserSettings(): Observable<UserSettings> {
    return this.http.get<UserSettings>(ApiUrl.settings(), httpOptions)
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
      this.user = undefined;
    }
  }

  private isRequireLogin(err: HttpErrorResponse): boolean {
    return err.error && err.error.msg.match(/login required/);
  }

  private checkLogin(): Observable<UserInfo> {
    return this.http.post<UserInfo>(ApiUrl.checkLogin(), {}, httpOptions)
      .pipe(
        tap((info: UserInfo) => {
          this.user = info;
        })
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (res: any): Observable<T> => {
      // Handle ERR_CONNECTION_REFUSED status 0
      if (res.status === 0) {
        this.message.error('lost connection to the server');
        return of(result as T);
      }

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
