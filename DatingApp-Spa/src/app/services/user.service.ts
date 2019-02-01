import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UserDetail } from '../models/user-detail.model';
import { AuthService } from './auth.service';
import { PaginatedResultResult as PaginatedResult } from '../models/pagination';
import { map } from 'rxjs/operators';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl + 'users/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUsers(
    pageNumber?,
    pageSize?,
    userParams?,
    likesParam?: LikesParam
  ): Observable<PaginatedResult<UserDetail[]>> {
    let params = new HttpParams();
    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }

    if (userParams) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if (likesParam && likesParam === 'likers') {
      params = params.append('likers', 'true');
    }

    if (likesParam && likesParam === 'likees') {
      params = params.append('likees', 'true');
    }

    const paginatedResult = new PaginatedResult<UserDetail[]>();
    return this.http
      .get<UserDetail[]>(this.baseUrl, { params, observe: 'response' })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('pagination')) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('pagination')
            );
          }
          return paginatedResult;
        })
      );
  }

  getUser(id: number): Observable<UserDetail> {
    return this.http.get<UserDetail>(`${this.baseUrl}/${id}`);
  }

  updateUser(id: number, user: UserDetail) {
    return this.http.put(`${this.baseUrl}/${id}`, user);
  }

  setMainPhoto(id: number) {
    return this.http.post(
      `${this.baseUrl}${
        this.authService.decondedToken.nameid
      }/photos/${id}/setmain`,
      {}
    );
  }

  deletePhoto(id: number) {
    return this.http.delete(
      `${this.baseUrl}${this.authService.decondedToken.nameid}/photos/${id}`
    );
  }

  like(likeeId: number) {
    return this.http.post(
      `${this.baseUrl}${this.authService.decondedToken.nameid}/like/${likeeId}`,
      {}
    );
  }

  getMessages(pageSize?, pageNumber?, messageContainer?: MessageContainer) {
    let params = new HttpParams();
    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }

    if (messageContainer) {
      params = params.append('messageContainer', messageContainer);
    }

    const paginatedResult = new PaginatedResult<Message[]>();

    return this.http
      .get<Message[]>(
        `${this.baseUrl}${this.authService.decondedToken.nameid}/messages/`,
        { observe: 'response', params }
      )
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('pagination')) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('pagination')
            );
          }
          return paginatedResult;
        })
      );
  }

  getThread(recipientId: number) {
    return this.http.get<Message[]>(
      `${this.baseUrl}${
        this.authService.decondedToken.nameid
      }/messages/thread/${recipientId}`
    );
  }

  sendMessage(message: Message) {
    return this.http.post(
      `${this.baseUrl}${this.authService.decondedToken.nameid}/messages`,
      message
    );
  }

  deleteMessage(messageId: number) {
    return this.http.post(
      `${this.baseUrl}${this.authService.decondedToken.nameid}/messages/${messageId}`,
      {}
    );
  }

  markAsRead(messageId: number) {
    return this.http.post(
      `${this.baseUrl}${this.authService.decondedToken.nameid}/messages/${messageId}/read`,
      {}
    ).subscribe();
  }
}
