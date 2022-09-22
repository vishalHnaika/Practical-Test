import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
export class Issue {
  id?: number;
  title?: string;
  state?: string;
  url?: string;
}
@Injectable()
export class DataService {
  private readonly API_URL = 'https://api.github.com/repos/angular/angular/issues';

  constructor(private httpClient: HttpClient) { }

  /**
   * Get all REST API data 
   * @returns 
   */
  getAllIssues(): Observable<any> {
    return this.httpClient.get(this.API_URL).pipe(
      tap((res: any) => {
      }),
      catchError(err => throwError(err))
    ) as Observable<any>;
  }
}




