import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../../modules/commerce/models';
import { environment } from '../../../environments/environment';

@Injectable()
export class ClientService {
  private baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getCustomers() {
    return this.http.get<Cliente[]>(`${this.baseUrl}customers`);
  }

  getCustomerByCode(codigo: number) {
    return this.http.get<Cliente>(`${this.baseUrl}customers/${codigo}`);
  }
}
