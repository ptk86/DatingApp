import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UserDetail } from '../models/user-detail.model';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'bearer' + localStorage.getItem('token')
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl + 'users/';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserDetail[]> {
    return this.http.get<UserDetail[]>(this.baseUrl, httpOptions);
  }

  getUser(id: number): Observable<UserDetail> {
    return this.http.get<UserDetail>(`this.baseUrl/${id}`, httpOptions);
  }
}
