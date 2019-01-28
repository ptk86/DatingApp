import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UserDetail } from '../models/user-detail.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl + 'users/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUsers(): Observable<UserDetail[]> {
    return this.http.get<UserDetail[]>(this.baseUrl);
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
