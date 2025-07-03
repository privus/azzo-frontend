import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Produto, UpdatedProduct } from '../../modules/commerce/models';
import { environment } from '../../../environments/environment';

@Injectable()
export class ProductsService {
  private baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getProducts() {
    return this.http.get<Produto[]>(`${this.baseUrl}products`);
  }

  getProductByCode(id: number) {
    return this.http.get<Produto>(`${this.baseUrl}products/${id}`);
  }

  updateProduct(productId: number, data: UpdatedProduct) {
    return this.http.patch<string>(`${this.baseUrl}products/${productId}/updateProduct`, data);
  }
}
