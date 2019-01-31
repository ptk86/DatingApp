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
export class ListsResolver implements Resolve<UserDetail[]> {
  likesParam: LikesParam = 'likers';
  page = 1;
  itemsPerPage = 24;

  constructor(
    private userService: UserService,
    private router: Router,
    private alertifyService: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<UserDetail[]> {
    return this.userService.getUsers(this.page, this.itemsPerPage, null, this.likesParam).pipe(
      catchError(error => {
        this.alertifyService.error('Problem retreiving data!');
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}
