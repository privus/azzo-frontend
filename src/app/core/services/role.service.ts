import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cargo, Permissao, Usuario } from '../../modules/account/models/user.model';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class RoleService {
  private baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getRoles() {
    return this.http.get<Cargo[]>(`${this.baseUrl}roles`);
  }

  createRole(cargo: { nome: string; permissoes: any[] }) {
    return this.http.post<Cargo>(`${this.baseUrl}roles/create`, cargo);
  }

  updateRole(roleId: number, payload: any) {
    return this.http.put<Cargo>(`${this.baseUrl}roles/update/${roleId}`, payload);
  }

  getRoleById(roleId: number) {
    return this.http.get<Cargo>(`${this.baseUrl}roles/${roleId}`);
  }

  deleteRole(roleId: number) {
    return this.http.delete(`${this.baseUrl}roles/delete/${roleId}`);
  }

  getPermissions(): Observable<Permissao[]> {
    return this.http.get<Permissao[]>(`${this.baseUrl}roles/permission`);
  }

  getUsersByRole(roleId: number) {
    return this.http.get<Usuario[]>(`${this.baseUrl}roles/${roleId}/users`);
  }
}
