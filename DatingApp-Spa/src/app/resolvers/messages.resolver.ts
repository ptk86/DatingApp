import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Message } from '../models/message';
import { AlertifyService } from '../services/alertify.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesResolver implements Resolve<Message[]> {
  pageNumber: 1;
  pageSize: 24;
  messageContainer: MessageContainer = 'unread';

  constructor(
    private userService: UserService,
    private router: Router,
    private alertifyService: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
    return this.userService.getMessages(this.pageNumber, this.pageSize, this.messageContainer).pipe(
      catchError(error => {
        this.alertifyService.error('Problem retreiving messages!');
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}
