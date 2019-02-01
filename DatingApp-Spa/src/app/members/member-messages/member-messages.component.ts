import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { Message } from 'src/app/models/message';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};

  constructor(
    private userService: UserService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit() {
    this.userService
      .getThread(this.recipientId)
      .subscribe(
        messages => (this.messages = messages),
        error => this.alertifyService.error(error)
      );
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService
      .sendMessage(this.newMessage)
      .subscribe(
        (message: Message) => {
          this.messages.unshift(message);
          this.newMessage = {};
        },
        error => this.alertifyService.error(error)
      );
  }
}
