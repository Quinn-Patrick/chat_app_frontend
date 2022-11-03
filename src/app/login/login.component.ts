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

  onSubmit(): void{
    let form: FormData = new FormData();
    if(!this.loginForm.value.username) return;
    if(!this.loginForm.value.password) return;

    let username: string = this.loginForm.value.username;
    let password: string = this.loginForm.value.password;

    

    form.append('username', username);
    form.append('password', password);
    this.userService.login(form).subscribe((access) => {
      this.cookieService.set('access_token', `Bearer ${access.access_token}`);
      this.cookieService.set('refresh_token', `Bearer ${access.refresh_token}`);
      this.cookieService.set('username', username);

      this.router.navigate(['/home']);

    });
  }
}
