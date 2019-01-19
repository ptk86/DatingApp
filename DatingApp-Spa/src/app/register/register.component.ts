import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() hideMe = new EventEmitter();

  model: any = {};

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  register(): void {
    this.authService.register(this.model).subscribe();
  }

  cancel(): void {
    this.hideMe.emit();
  }
}
