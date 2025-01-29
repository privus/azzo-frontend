import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pedido } from '../../modules/commerce/models';
import { environment } from '../../../environments/environment';

@Injectable()
export class SellService {
  private baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getAllOrders() {
    return this.http.get<Pedido[]>(`${this.baseUrl}sells`);
  }

  getOrderById(id: number) {
    return this.http.get<Pedido>(`${this.baseUrl}sells/${id}`);
  }

  getOrdersByDate(fromDate: string) {
    return this.http.get<Pedido[]>(`${this.baseUrl}sells?fromDate=${fromDate}`);
  }

  syncroAllOrders() {
    return this.http.get<{ message: string }>(`${this.baseUrl}sells/syncro`);
  }
}
