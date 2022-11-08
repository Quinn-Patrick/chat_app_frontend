import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from './user';
import { Access } from './access';
import { HttpOptionsService } from './http-options.service';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = `${environment.api}/api`;
  constructor(
    private http: HttpClient,
    private httpOptionsService: HttpOptionsService,
    private errorHandlingService: ErrorHandlingService) { }

  login(form: FormData): Observable<Access>{
    return this.http.post<Access>(this.userUrl + '/login', form)
    .pipe(catchError(this.errorHandlingService.handleError));
  }

  signup(user: any): Observable<User>{
    return this.http.post<User>(`${this.userUrl}/user/save`, user)
    .pipe(catchError(this.errorHandlingService.handleError));
  }

  getUser(username: string): Observable<User>{
    const httpOptions = this.httpOptionsService.getHttpHeaders();
    return this.http.get<User>(`${this.userUrl}/user/${username}`, httpOptions)
    .pipe(catchError(this.errorHandlingService.handleError));
  }

  getUsers(): Observable<User[]>{
    const httpOptions = this.httpOptionsService.getHttpHeaders();
    return this.http.get<User[]>(`${this.userUrl}/users/`, httpOptions)
    .pipe(catchError(this.errorHandlingService.handleError));
  }
}
