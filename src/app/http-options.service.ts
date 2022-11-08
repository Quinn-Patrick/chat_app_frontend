import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
//This just lets us grab the standard http headers found in methods
//throughout the app without repeating code.
export class HttpOptionsService {

  constructor(private cookieService: CookieService) { }

  getHttpHeaders(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.cookieService.get("access_token")
      })
    }
    return httpOptions;
  }
}
