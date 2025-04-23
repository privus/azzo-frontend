import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order, Ranking, UpdateSellStatus } from '../../modules/commerce/models';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { BrandSales, Commissions, PositivityByBrandResponse, VendedorPositivacao } from '../../modules/sellers/models';
import { SalesComparisonReport } from 'src/app/pages/models/performance-sales.modal';

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
    return this.http.get<Order>(`${this.baseUrl}sells/code${id}`);
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

  getCommissions(fromDate: string, toDate?: string): Observable<Commissions[]> {
    return this.http.get<Commissions[]>(`${this.baseUrl}sells/commissions?fromDate=${fromDate}${toDate}`);
  }

  getPositivity(fromDate: string, toDate?: string): Observable<PositivityByBrandResponse> {
    return this.http.get<PositivityByBrandResponse>(`${this.baseUrl}sells/brandPositivity?fromDate=${fromDate}${toDate}`);
  }

  getPositivityAzzo(fromDate: string, toDate?: string): Observable<VendedorPositivacao> {
    return this.http.get<VendedorPositivacao>(`${this.baseUrl}sells/brandPositivityAzzo?fromDate=${fromDate}${toDate}`);
  }

  addVolumeSell(id: number, volume: number) {
    return this.http.get<{ message: string }>(`${this.baseUrl}sells/vol/${id}?volume=${volume}`);
  }

  performanceSales(fromDate1: string, toDate1: string, fromDate2: string, toDate2: string) {
    return this.http.get<SalesComparisonReport>(
      `${this.baseUrl}sells/salesPerformance?fromDate1=${fromDate1}&toDate1=${toDate1}&fromDate2=${fromDate2}&toDate2=${toDate2}`,
    );
  }
}
