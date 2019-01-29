import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { UserDetail } from '../models/user-detail.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl =  environment.apiUrl + 'auth/';

  jwtHelper = new JwtHelperService();
  decondedToken: any;

  constructor(private http: HttpClient) {}

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((response: any) => {
        if (response) {
          localStorage.setItem('token', response.token);
          this.decondedToken = this.jwtHelper.decodeToken(response.token);
        }
      })
    );
  }

  register(user: UserDetail) {
    return this.http.post(this.baseUrl + 'register', user);
  }

  loggedId() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  get id() {
    return this.decondedToken.userId;
  }
}
