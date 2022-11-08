import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from './message';
import { CookieService } from 'ngx-cookie-service';
import { HttpOptionsService } from './http-options.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private url = `${environment.api}/api`;
  constructor(
    private http: HttpClient, 
    private httpOptionsService: HttpOptionsService,
    private errorHandlingService: ErrorHandlingService) { }

  //Get all of the messages belonging to both user1 and user2 from the server.
  getMessages(username1: string, username2: string): Observable<Message[]>{
    const httpOptions = this.httpOptionsService.getHttpHeaders();
    return this.http.get<Message[]>(`${this.url}/messages/${username1}/${username2}`, httpOptions).pipe(catchError(this.errorHandlingService.handleError));
  }

  //Send a new message.
  postMessage(message: Message): Observable<String>{
    const httpOptions = this.httpOptionsService.getHttpHeaders();
    return this.http.post<String>(`${this.url}/message/send`, message, httpOptions).pipe(catchError(this.errorHandlingService.handleError));
  }

  
}
