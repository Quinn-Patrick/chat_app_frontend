import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {Router} from "@angular/router"
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signupForm = this.formBuilder.group({
    username: '',
    password: '',
    confirmPassword: ''
  });

  constructor(private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.signupForm.value.password != this.signupForm.value.confirmPassword){
      return;
    }
    if(this.signupForm.value.username && this.signupForm.value.password && this.signupForm.value.confirmPassword ){
      const user = {
        username: this.signupForm.value.username,
        password: this.signupForm.value.password
      }
      this.userService.signup(user).subscribe(x => this.router.navigate(['/']));
    }
  }
}
