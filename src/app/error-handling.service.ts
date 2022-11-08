import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
//Standardized error handling for http requests.
export class ErrorHandlingService {

  constructor(private router: Router) { }

  handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
        
    }
    // Return an observable with a user-facing error message.
    return throwError(() => {
      new Error('Something bad happened; please try again later.');
      this.router.navigate(['/']); //Go home if there's an error, since it was probably caused by the user not being properly logged in.
    });
  }
}
