import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserDetail } from '../../models/user-detail.model';
import { AlertifyService } from '../../services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: UserDetail[] = [];
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => (this.users = data['users']));
  }
}
