import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from './user';
import { Access } from './access';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = `${environment.api}/api`;
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  login(form: FormData): Observable<Access>{
    return this.http.post<Access>(this.userUrl + '/login', form);
  }

  getUser(username: string): Observable<User>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.cookieService.get("access_token")
      })
    }
    return this.http.get<User>(`${this.userUrl}/user/${username}`, httpOptions);
  }

  getUsers(): Observable<User[]>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.cookieService.get("access_token")
      })
    }
    return this.http.get<User[]>(`${this.userUrl}/users/`, httpOptions);
  }
}
