import { Component, OnInit } from '@angular/core';
import { UserDetail } from '../../models/user-detail.model';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from 'src/app/models/pagination';
import { UserService } from 'src/app/services/user.service';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: UserDetail[] = [];
  genderList = [
    { value: 'male', dispaly: 'Males' },
    { value: 'female', dispaly: 'Females' }
  ];
  userParams: any = {};
  pagination: Pagination;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(
      data => (this.users = data['users'].result)
    );
    this.activatedRoute.data.subscribe(
      data => (this.pagination = data['users'].pagination)
    );
    this.setInitialUserParams();
  }

  setInitialUserParams(){
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.gender = 'female';
  }

  resetFilters() {
    this.setInitialUserParams();
    this.loadUsers();
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService
      .getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe(
        res => {
          this.users = res.result;
          this.pagination = res.pagination;
        },
        error => this.alertifyService.error(error)
      );
  }
}
