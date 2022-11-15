import { Component, Input, OnInit } from '@angular/core';
import { User } from '../user';
import { Message } from '../message';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { MessageService } from '../message.service';
import { interval, Subscription } from 'rxjs';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
//The chat room itself. The way it works is a bit complicated.
export class ChatRoomComponent implements OnInit {
  //User1 (the person logged in on this browser) and User2 (the person they are chatting with)
  //are passed in from the path.
  @Input() user1?: User;
  @Input() user2?: User;

  //messageInput is bound to the input field.
  messageInput: string = '';
  private url = `${environment.api}`;

  //We'll need this for the websocket connection.
  private stompClient: any = null;

  //This is the list of messages thay are shown on screen.
  messages: Message[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,) {}

  ngOnInit(): void {
    this.getBothUsers(); //We need to pull in both of the users from the database.
    this.connect(); //We also need to connect to the server via websockets.
  }

  ngOnDestroy(): void{
    this.disconnect(); //When the component is destroyed, the connection to the server will end.
  }

  //This function initiates the websocket connection.
  connect(): void{
    const socket = new SockJS(`${this.url}/chat`); //The endpoints are dictated by the server.
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame: any) => {
      console.log('Connected: ' + frame);
      this.stompClient.subscribe(`/topic/messages`, (messageOutput: any) => {
          console.log("Message received."); //No actual (useful) data is contained in the response. It's just so the client knows when to check.
          this.getMessages(); //Once the server tells the client that a new message has been sent, the client has to ask what it is.
          //This keeps everything synchronized, and it allows the messages to be persistent in a database.
      })
    })
  }

  
  getBothUsers(): void{
    const username1: string = this.route.snapshot.paramMap.get('username1')! //Pull in the username from the path.
    this.userService.getUser(username1).subscribe((user) => {
      this.user1 = user;
      this.getMessages();
      if(this.user1 == null){
        this.router.navigate(['/home']);
      }
    })

    //Do it again for user2. Doing it twice seems like a code smell, but it's simpler this way due to the observables.
    const username2: string = this.route.snapshot.paramMap.get('username2')! 
    console.log(`user 2 is named ${username2}`);
    this.userService.getUser(username2).subscribe((user) =>{ 
      this.user2 = user
      this.getMessages();
      if(this.user2 == null){
        this.router.navigate(['/home']);
      }
    })
  }

  //This just disconnects from the server.
  disconnect(): void{
    if(this.stompClient != null){
      this.stompClient.disconnect();
    }
    console.log("disconnected");
  }

  //Sending a message involves pinging both the socket AND the REST api.
  sendMessage(): void{
    if(this.user1 && this.user2 && this.messageInput){
      const message: Message = {
        user1: this.user1,
        user2: this.user2,
        content: this.messageInput,
        date: new Date().toLocaleString()
      }
      this.messageInput = ''; //Clear the message box.
      this.messageService.postMessage(message).subscribe((output) =>{
        this.getMessages(); //Pull in the other messages, to ensure that you are up to date with yourself.
        this.stompClient.send(`/app/room`, {}, JSON.stringify(message)) //Ping the websocket only after the message has been added to the database.
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