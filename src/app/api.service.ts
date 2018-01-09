import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { API_URL, ProblemsetInfo } from './constants';

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }

  private problemsetListUrl: string = API_URL + 'problemsetList';

  getProblemsetList(): Observable<ProblemsetInfo[]> {
    return this.http.get<ProblemsetInfo[]>(this.problemsetListUrl);
  }

  getProblemset(problemset: string): Observable<ProblemsetInfo> {
    const url = `${this.problemsetListUrl}/${problemset}`;
    return this.http.get<ProblemsetInfo>(url);
  }

}
