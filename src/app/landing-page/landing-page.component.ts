import { Component, Input, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  user: User = {id: 0, username: ""};
  allUsers: User[] = [];

  constructor(private userService: UserService, private cookieService: CookieService) { }

  ngOnInit(): void {
    //The username should be stored as a cookie since loggin in.
    this.userService.getUser(this.cookieService.get('username')).subscribe((user) => this.user = user);
    //Pull in all of the users for the list.
    this.userService.getUsers().subscribe((users) => this.allUsers = users);
  }

}
