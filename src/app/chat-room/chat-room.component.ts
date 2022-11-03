import { Component, Input, OnInit } from '@angular/core';
import { User } from '../user';
import { Message } from '../message';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {
  @Input() user1?: User;
  @Input() user2?: User;

  messageInput: string = '';

  messages: Message[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
    ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void{
    const username1: string = this.route.snapshot.paramMap.get('username1')!
    console.log(`user 1 is named ${username1}`);
    this.userService.getUser(username1).subscribe((user) => {
      this.user1 = user;
      if(this.user1 == null){
        this.router.navigate(['/home']);
      }
    })

    const username2: string = this.route.snapshot.paramMap.get('username2')!
    console.log(`user 2 is named ${username2}`);
    this.userService.getUser(username2).subscribe((user) =>{ 
      this.user2 = user
      if(this.user2 == null){
        this.router.navigate(['/home']);
      }
    })
  }

  sendMessage(): void{
    if(this.user1 && this.user2 && this.messageInput){
      const message: Message = {
        user1: this.user1,
        user2: this.user2,
        content: this.messageInput,
        date: new Date().toLocaleString()
      }
      this.messageService.postMessage(message).subscribe((output) =>{
        //console.log(output);
        this.getMessages();
      });
    }
  }

  getMessages(): void{
    if(this.user1 && this.user2){
      this.messageService.getMessages(this.user1.username, this.user2.username).subscribe((messages) => {
        this.messages = messages;
      });
    }
  }
}
