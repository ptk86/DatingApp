import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() hideMe = new EventEmitter();

  model: any = {};

  ngOnInit(): void {}

  register(): void {
    console.log('register: ' + this.model);
  }

  cancel(): void {
    this.hideMe.emit();
  }
}
