import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthLogin, AuthTokens } from '../../modules/auth/models/auth.model';
import { Cargo, Cidade, NewUser, UserUpdate, Usuario } from '../../modules/account/models/user.model';

@Injectable()
export class AzzoService {
  private baseUrl: string;
  constructor(private readonly http: HttpClient) {
    this.baseUrl = 'http://localhost:3000/';
  }

  login(login: AuthLogin) {
    return this.http.post<AuthTokens>(`${this.baseUrl}auth/login`, login);
  }

  getUserById(id: number) {
    return this.http.get<Usuario>(`${this.baseUrl}users/${id}`);
  }

  UpdateUser(userId: number, user: UserUpdate) {
    return this.http.put<Usuario>(`${this.baseUrl}users/${userId}`, user);
  }

  getAllCities() {
    return this.http.get<Cidade[]>(`${this.baseUrl}shared/cities`);
  }

  getCitiesPartial(query: string) {
    return this.http.get<Cidade[]>(`${this.baseUrl}shared/cities/partial`, {
      params: { q: query },
    });
  }

  newUser(user: NewUser) {
    return this.http.post<Usuario>(`${this.baseUrl}auth/register`, user);
  }

  getAllUsers() {
    return this.http.get<Usuario[]>(`${this.baseUrl}users`);
  }

  deleteUser(userId: number) {
    return this.http.delete(`${this.baseUrl}users/${userId}`);
  }

  getRoles() {
    return this.http.get<Cargo[]>(`${this.baseUrl}roles`);
  }

  createRole(cargo: Cargo) {
    return this.http.post<Cargo>(`${this.baseUrl}roles/create`, cargo);
  }

  updateRole(roleId: number, cargo: Cargo) {
    return this.http.put<Cargo>(`${this.baseUrl}roles/update/${roleId}`, cargo);
  }

  getRoleById(roleId: number) {
    return this.http.get<Cargo>(`${this.baseUrl}roles/${roleId}`);
  }

  deleteRole(roleId: number) {
    return this.http.delete(`${this.baseUrl}roles/delete/${roleId}`);
  }

  getUsersByRole(roleId: number) {
    return this.http.get<Usuario[]>(`${this.baseUrl}roles/${roleId}/users`);
  }
}
