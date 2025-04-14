import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order, Ranking, UpdateSellStatus } from '../../modules/commerce/models';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { BrandSales, Commissions, PositivityByBrandResponse } from '../../modules/sellers/models';

@Injectable()
export class SellService {
  private baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getAllOrders() {
    return this.http.get<Order[]>(`${this.baseUrl}sells`);
  }

  getOrdersByDateRange(fromDate: string, toDate?: string) {
    return this.http.get<Order[]>(`${this.baseUrl}sells/between?fromDate=${fromDate}${toDate}`);
  }

  getOrderById(id: number) {
    return this.http.get<Order>(`${this.baseUrl}sells/${id}`);
  }

  getOrdersByDate(fromDate: string) {
    return this.http.get<Order[]>(`${this.baseUrl}sells?fromDate=${fromDate}`);
  }

  syncroAllOrders() {
    return this.http.get<{ message: string }>(`${this.baseUrl}sells/syncro`);
  }

  updateSellStatus(updateStatus: UpdateSellStatus) {
    return this.http.patch<{ message: string }>(`${this.baseUrl}sells/status`, updateStatus);
  }

  exportTiny(id: number) {
    return this.http.get<{ message: string }>(`${this.baseUrl}sells/export/${id}`);
  }

  getSellerRanking(): Observable<Ranking> {
    return this.http.get<Ranking>(`${this.baseUrl}sells/ranking`);
  }

  getSellsByBrand(fromDate: string, toDate?: string): Observable<BrandSales> {
    return this.http.get<BrandSales>(`${this.baseUrl}sells/brand?fromDate=${fromDate}${toDate}`);
  }

  getCommissions(): Observable<Commissions[]> {
    return this.http.get<Commissions[]>(`${this.baseUrl}sells/commissions`);
  }

  getPositivity(fromDate: string, toDate?: string): Observable<PositivityByBrandResponse> {
    return this.http.get<PositivityByBrandResponse>(`${this.baseUrl}sells/brandPositivity?fromDate=${fromDate}${toDate}`);
  }

  addVolumeSell(id: number, volume: number) {
    return this.http.get<{ message: string }>(`${this.baseUrl}sells/vol/${id}?volume=${volume}`);
  }
}
