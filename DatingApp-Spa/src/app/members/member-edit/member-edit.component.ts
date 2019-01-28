import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDetail } from 'src/app/models/user-detail.model';
import { NgForm } from '@angular/forms';
import { AlertifyService } from 'src/app/services/alertify.service';
import { UserService } from 'src/app/services/user.service';
import { PhotoForUserDetail } from 'src/app/models/photo-for-user-detail.model';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  user: UserDetail;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertifyService: AlertifyService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => (this.user = data['user']));
  }

  update(): void {
    this.userService.updateUser(this.user.id, this.user).subscribe(
      () => {
        this.alertifyService.success('User successfuly edited!');
        this.editForm.reset(this.user);
      },
      error => this.alertifyService.error(error)
    );
  }

  updateMainPhoto(url: string){
    this.user.photoUrl = url;
  }
}
