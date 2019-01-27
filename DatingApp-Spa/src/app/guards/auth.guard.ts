import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AlertifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  canActivate(): boolean {
    if (this.auth.loggedId()) {
      return true;
    }

    this.alertify.error('You shall not pass!');
    this.router.navigate(['/home']);
    return false;
  }
}
