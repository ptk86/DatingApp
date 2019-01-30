import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UserDetail } from '../models/user-detail.model';
import { AuthService } from './auth.service';
import { PaginatedResultResult } from '../models/pagination';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl + 'users/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUsers(pageNumber?, pageSize?, userParams?): Observable<PaginatedResultResult<UserDetail[]>> {
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

    const paginatedResult = new PaginatedResultResult<UserDetail[]>();
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
}
