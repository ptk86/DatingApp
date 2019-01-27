import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserDetail } from '../models/user-detail.model';
import { UserService } from '../services/user.service';
import { AlertifyService } from '../services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MemberEditResolver implements Resolve<UserDetail> {
  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<UserDetail> {
    return this.userService.getUser(this.authService.decondedToken.nameid).pipe(
      catchError(error => {
        this.alertifyService.error('Problem retreiving your data!');
        this.router.navigate(['/members']);
        return of(null);
      })
    );
  }
}
