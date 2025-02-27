import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Produto } from '../../modules/commerce/models';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

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

  updateTinyCodes(productId: number, data: { tiny_mg: number; tiny_sp: number }): Observable<any> {
    return this.http.patch(`${this.baseUrl}products/${productId}/tiny-codes`, data);
  }  
}
