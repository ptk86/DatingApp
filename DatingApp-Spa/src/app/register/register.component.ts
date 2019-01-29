import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() hideMe = new EventEmitter();
  registerFrom: FormGroup;

  model: any = {};

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.registerFrom = this.formBuilder.group({
      username: ['', [Validators.required]],
      passowrd: ['', [Validators.required, Validators.minLength(4), Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    })
  }

  register(): void {
    this.authService
      .register(this.model)
      .subscribe(
        () => this.alertify.success('Registration successful!'),
        e => this.alertify.error(e)
      );
  }

  cancel(): void {
    this.hideMe.emit();
  }
}
