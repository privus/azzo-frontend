import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Produto } from '../../modules/commerce/models';
import { environment } from '../../../environments/environment';

@Injectable()
export class ItemService {
  private baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getProducts() {
    return this.http.get<Produto[]>(`${this.baseUrl}products`);
  }

  getProductByCode(id: number) {
    return this.http.get<Produto>(`${this.baseUrl}products/${id}`);
  }
}
