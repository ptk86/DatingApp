import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { Message } from 'src/app/models/message';
import { tap } from 'rxjs/internal/operators/tap';
import { AuthService } from 'src/app/services/auth.service';

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
    private alertifyService: AlertifyService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const currentUserId = +this.authService.decondedToken.nameid;
    this.userService
      .getThread(this.recipientId)
      .pipe(
        tap(messages => {
          for (let i = 0; i < messages.length; i++) {
            if(messages[i].isRead === false && messages[i].recipientId === currentUserId){
              this.userService.markAsRead(messages[i].id);
            }
          }
        })
      )
      .subscribe(
        messages => (this.messages = messages),
        error => this.alertifyService.error(error)
      );
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.newMessage).subscribe(
      (message: Message) => {
        this.messages.unshift(message);
        this.newMessage = {};
      },
      error => this.alertifyService.error(error)
    );
  }
}
