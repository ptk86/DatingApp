import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UserDetail } from '../models/user-detail.model';
import { AlertifyService } from '../services/alertify.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class MemberDetailResolver implements Resolve<UserDetail> {
  constructor(
    private userService: UserService,
    private router: Router,
    private alertifyService: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<UserDetail> {
    return this.userService.getUser(route.params['id']).pipe(
      catchError(error => {
        this.alertifyService.error('Problem retreiving data!');
        this.router.navigate(['/members']);
        return of(null);
      })
    );
  }
}
