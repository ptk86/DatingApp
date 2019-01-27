import { Component, OnInit, Input } from '@angular/core';
import { UserDetail } from 'src/app/models/user-detail.model';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() user: UserDetail;

  constructor() { }

  ngOnInit() {
  }

}
