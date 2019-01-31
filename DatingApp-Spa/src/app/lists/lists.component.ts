import { Component, OnInit } from '@angular/core';
import { UserDetail } from '../models/user-detail.model';
import { Pagination } from '../models/pagination';
import { UserService } from '../services/user.service';
import { AlertifyService } from '../services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  users: UserDetail[] = [];
  likesParam: LikesParam;
  pagination: Pagination;

  constructor(
    private userService: UserService,
    private alertifyService: AlertifyService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(
      data => {
        this.users = data['data'].result;
        console.log(data);
      }
    );
    this.activatedRoute.data.subscribe(
      data => this.pagination = data['data'].pagination
    );
    this.likesParam = 'likers';
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService
      .getUsers(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        null,
        this.likesParam
      )
      .subscribe(
        res => {
          this.users = res.result;
          this.pagination = res.pagination;
        },
        error => this.alertifyService.error(error)
      );
  }
}
