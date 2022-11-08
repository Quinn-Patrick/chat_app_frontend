import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {Router} from "@angular/router"
import { UserService } from '../user.service';
import {CookieService} from 'ngx-cookie-service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private userService: UserService,
     private formBuilder: FormBuilder,
     private cookieService: CookieService,
     private router: Router) { }

  loginForm = this.formBuilder.group({
    username: '',
    password: ''
  })

  ngOnInit(): void {
  }

  //Called when the submit button is clicked.
  onSubmit(): void{
    let form: FormData = new FormData();
    //Don't bother if either of the fields are empty.
    if(!this.loginForm.value.username || !this.loginForm.value.password) return;

    let username: string = this.loginForm.value.username;
    let password: string = this.loginForm.value.password;

    //Build up the form data object that will be sent, 
    //since the backend only accepts form data for login.
    form.append('username', username);
    form.append('password', password);
    this.userService.login(form).subscribe((access) => {
      //The backend should come back with an access token and a refresh token which we will store in cookies.
      //The refresh token is not currently used.
      this.cookieService.set('access_token', `Bearer ${access.access_token}`);
      this.cookieService.set('refresh_token', `Bearer ${access.refresh_token}`);
      //We will also store the username, which will come in handy.
      this.cookieService.set('username', username);

      //Go back to the login page after signing up.
      this.router.navigate(['/home']);

    });
  }
}
