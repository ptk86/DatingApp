import { Component, OnInit, Input } from '@angular/core';
import { UserDetail } from 'src/app/models/user-detail.model';
import { UserService } from 'src/app/services/user.service';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() user: UserDetail;

  constructor(
    private userService: UserService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit() {}

  like() {
    this.userService
      .like(this.user.id)
      .subscribe(
        () => this.alertifyService.success(`You like ${this.user.knownAs}!`),
        error => this.alertifyService.error(error)
      );
  }
}
