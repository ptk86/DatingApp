import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() hideMe = new EventEmitter();

  model: any = {};

  constructor(private authService: AuthService, private alertify: AlertifyService) {}

  ngOnInit(): void {}

  register(): void {
    this.authService.register(this.model).subscribe(
      () => this.alertify.success('Registration successful!'),
      e => this.alertify.error(e)
    );
  }

  cancel(): void {
    this.hideMe.emit();
  }
}
