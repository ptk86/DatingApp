import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserDetail } from '../models/user-detail.model';
import { UserService } from '../services/user.service';
import { AlertifyService } from '../services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MemberListResolver implements Resolve<UserDetail[]> {
  constructor(
    private userService: UserService,
    private router: Router,
    private alertifyService: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<UserDetail[]> {
    return this.userService.getUsers(1, 5).pipe(
      catchError(error => {
        this.alertifyService.error('Problem retreiving data!');
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}
