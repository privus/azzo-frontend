import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthLogin, AuthTokens } from '../../modules/auth/models/auth.model';
import { environment } from '../../../environments/environment';
import { NewUser, Usuario } from '../../modules/account/models/user.model';

@Injectable()
export class LoginService {
  private baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  login(login: AuthLogin) {
    return this.http.post<AuthTokens>(`${this.baseUrl}auth/login`, login);
  }

  register(user: any) {
    return this.http.post(`${this.baseUrl}auth/register`, user);
  }

  newUser(user: NewUser) {
    return this.http.post<Usuario>(`${this.baseUrl}auth/register`, user);
  }
}
