import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(private auth: AuthService, private alertify: AlertifyService) {}

  ngOnInit() {}

  login() {
    this.auth.login(this.model).subscribe(
      () => this.alertify.success('Logged in successfully!'),
      e => this.alertify.error(e)
    );
  }

  loggedIn(): boolean {
    return this.auth.loggedId();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.alertify.message('Logged out!');
  }
}
