import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from './message';
import { CookieService } from 'ngx-cookie-service';
import { HttpOptionsService } from './http-options.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private url = `${environment.api}/api`;
  constructor(
    private http: HttpClient, 
    private httpOptionsService: HttpOptionsService) { }

  getMessages(username1: string, username2: string): Observable<Message[]>{
    const httpOptions = this.httpOptionsService.getHttpHeaders();
    return this.http.get<Message[]>(`${this.url}/messages/${username1}/${username2}`, httpOptions);
  }

  postMessage(message: Message): Observable<String>{
    const httpOptions = this.httpOptionsService.getHttpHeaders();
    return this.http.post<String>(`${this.url}/message/send`, message, httpOptions);
  }
}
