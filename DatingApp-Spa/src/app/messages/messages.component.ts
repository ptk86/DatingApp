import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { Pagination } from '../models/pagination';
import { UserService } from '../services/user.service';
import { AlertifyService } from '../services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer: MessageContainer = 'unread';

  constructor(
    private userService: UserService,
    private alertifyService: AlertifyService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.messages = data['data'].result;
      this.pagination = data['data'].pagination;
    });
  }

  loadMessages(): void {
    this.userService
      .getMessages(
        this.pagination.itemsPerPage,
        this.pagination.currentPage,
        this.messageContainer
      )
      .subscribe(
        paginatedMessages => {
          this.messages = paginatedMessages.result;
          this.pagination = paginatedMessages.pagination;
        },
        error => this.alertifyService.error(error)
      );
  }

  pageChanged(event): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }
}
