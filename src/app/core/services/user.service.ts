import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario, UserUpdate } from '../../modules/account/models/user.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class UserService {
  private baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getUserById(id: number) {
    return this.http.get<Usuario>(`${this.baseUrl}users/${id}`);
  }

  updateUser(userId: number, user: UserUpdate) {
    return this.http.put<Usuario>(`${this.baseUrl}users/${userId}`, user);
  }

  getAllUsers() {
    return this.http.get<Usuario[]>(`${this.baseUrl}users`);
  }

  deleteUser(userId: number) {
    return this.http.delete(`${this.baseUrl}users/${userId}`);
  }

  uploadUserPhoto(userId: number, formData: FormData) {
    return this.http.post<{ message: string; fotoUrl: string }>(`${this.baseUrl}users/${userId}/foto`, formData);
  }
}
