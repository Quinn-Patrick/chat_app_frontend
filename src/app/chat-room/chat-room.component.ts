import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';


import { Component, Input, OnInit } from '@angular/core';
import { User } from '../user';
import { Message } from '../message';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { MessageService } from '../message.service';
import { interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {
  @Input() user1?: User;
  @Input() user2?: User;

  private url = `${environment.api}`;
  private stompClient: any = null;

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
    this.connect();
  }

  ngOnDestroy(){
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

  connect(): void{
    const socket = new SockJS(`${this.url}/ws`);
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame: any) => {
      console.log('Connected: ' + frame);
      this.stompClient.subscribe(`${this.url}/topic/messages`, (messageOutput: any) => {
        if(this.compareUsers(messageOutput)){
          this.messages.concat(messageOutput.body);
          console.log("Message recieved.");
        }else{
          console.log("Incoming message does not belong in this chat room.");
        }
      })
    })
  }

  //This method ensures that the incoming messages belong in this chat room.
  compareUsers(messageOutput: any): boolean{
    const incomingUsername1: string = messageOutput.body.user1.username;
    const incomingUsername2: string = messageOutput.body.user2.username;

    return ((incomingUsername1 === this.user1?.username && incomingUsername2 === this.user2?.username) 
    || (incomingUsername2 === this.user1?.username && incomingUsername1 === this.user2?.username))
  }

  sendMessage(): void{
    if(this.user1 && this.user2){
      const message: Message = {
        user1: this.user1,
        user2: this.user2,
        content: this.messageInput,
        date: new Date().toLocaleString()
      }
      this.messageInput = '';
      this.stompClient.send(`${this.url}/app/chat`, {}, JSON.stringify(message));
      this.storeMessage(message);
    }
  }

  storeMessage(message: Message): void{
    if(this.user1 && this.user2 && this.messageInput){
      this.messageService.postMessage(message).subscribe((output) =>{
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
