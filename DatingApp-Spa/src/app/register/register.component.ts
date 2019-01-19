import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model: any = {};

  ngOnInit(): void {}

  register(): void {
    console.log('register: ' + this.model);
  }

  cancel(): void {
    console.log('cancel');
  }
}
