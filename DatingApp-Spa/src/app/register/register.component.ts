import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { UserDetail } from '../models/user-detail.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() hideMe = new EventEmitter();
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        gender: ['male'],
        username: ['', [Validators.required]],
        knownAs: ['', [Validators.required]],
        dateOfBirth: [null, [Validators.required]],
        city: ['', [Validators.required]],
        country: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(8)
          ]
        ],
        confirmPassword: ['', [Validators.required]]
      },
      { validator: this.passwordMatchValidator }
    );

    this.bsConfig = {
      containerClass: 'theme-red'
    };
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null
      : { mismatch: true };
  }

  register(): void {
    if (!this.registerForm.valid) {
      return;
    }

    const user: UserDetail = Object.assign({}, this.registerForm.value);
    this.authService.register(user).subscribe(
      () => {
        this.alertify.success('Registration successful');
        this.authService.login(user).subscribe(() => {
          this.router.navigate(['/members']);
        });
      },
      error => {
        this.alertify.error(error);
      }
    );
  }

  cancel(): void {
    this.hideMe.emit();
  }
}
