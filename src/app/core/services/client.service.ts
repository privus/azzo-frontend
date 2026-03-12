import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../../modules/commerce/models';
import { environment } from '../../../environments/environment';
import { StatusAnalyticsByRegion } from '../../pages/models';

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

  getStatusHistory(regiao_id: number, data: Date) {
    return this.http.get<StatusAnalyticsByRegion>(`${this.baseUrl}customers/regiao/${regiao_id}/status?data_registro=${data.toISOString()}`);
  }
}
