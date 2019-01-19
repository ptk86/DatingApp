import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(private auth: AuthService) {}

  ngOnInit() {}

  login() {
    this.auth.login(this.model).subscribe();
  }

  loggedIn(): boolean{
    const token = localStorage.getItem('token');
    return !!token;
  }

  logout(): void {
    const token = localStorage.removeItem('token');
  }
}
