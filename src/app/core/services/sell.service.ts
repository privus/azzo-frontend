import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order, PFormaPagamento, POrder, Ranking, UpdateSellPerson, UpdateSellStatus } from '../../modules/commerce/models';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { BrandSales, Commissions, CommissionsReport, Goals, PositivityByBrandResponse, VendedorPositivacao } from '../../modules/sellers/models';
import { SalesComparisonReport } from 'src/app/pages/models/performance-sales.modal';
import { PGenerateCredit } from 'src/app/modules/financial/models';
import { AssemblyDto, AssemblyResponse } from 'src/app/modules/expedition/models';

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

  getOrdersByDateRangeP(fromDate: string, toDate?: string) {
    return this.http.get<POrder[]>(`${this.baseUrl}Psells/between?fromDate=${fromDate}${toDate}`);
  }

  getOrderById(id: number) {
    return this.http.get<Order>(`${this.baseUrl}sells/${id}`);
  }

  getOrderByIdP(id: number) {
    return this.http.get<POrder>(`${this.baseUrl}Psells/${id}`);
  }

  getOrdersByDate(fromDate: string) {
    return this.http.get<Order[]>(`${this.baseUrl}sells?fromDate=${fromDate}`);
  }

  getOrdersByDateP(fromDate: string) {
    return this.http.get<POrder[]>(`${this.baseUrl}Psells?fromDate=${fromDate}`);
  }

  syncroAllOrders() {
    return this.http.get<{ message: string }>(`${this.baseUrl}sells/syncro`);
  }

  updateSellStatus(updateStatus: UpdateSellStatus) {
    return this.http.patch<{ message: string }>(`${this.baseUrl}sells/status`, updateStatus);
  }

  updateSellStatusP(updateStatus: UpdateSellPerson) {
    return this.http.patch<{ message: string }>(`${this.baseUrl}Psells/status`, updateStatus);
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

  uploadFiles(vendaId: number, files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return this.http.post<{ message: string }>(`${this.baseUrl}files/upload/${vendaId}`, formData);
  }

  syncroInvoiceNf() {
    return this.http.get<{ message: string }>(`${this.baseUrl}sells/syncroInvoiceNfe`);
  }

  deleteOrder(id: number) {
    return this.http.delete<{ message: string }>(`${this.baseUrl}sells/${id}`);
  }

  getInProduction() {
    return this.http.get<number>(`${this.baseUrl}sells/prod`);
  }

  installmentGenerate(orderId: number, parcelas: PGenerateCredit[]): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}Psells/installments`, {
      venda_id: orderId,
      parcelas,
    });
  }

  getAllPaymentMethods() {
    return this.http.get<PFormaPagamento[]>(`${this.baseUrl}Psells/paymentMethods`);
  }

  deleteNfData(id: number) {
    return this.http.get<{ message: string }>(`${this.baseUrl}sells/clearNf/${id}`);
  }

  updateAssembly(dto: AssemblyDto) {
    return this.http.post<string>(`${this.baseUrl}assembly`, dto);
  }

  getAssemblyProgress(codigos: number[]) {
    const q = codigos.join(',');
    return this.http.get<AssemblyResponse[]>(`${this.baseUrl}assembly/progress?orders=${q}`);
  }

  getWeeklyBonus(fromDate: string, toDate: string) {
    return this.http.get<any>(`${this.baseUrl}sells/weeklyBonus?fromDate=${fromDate}&toDate=${toDate}`);
  }

  exportBling(id: number) {
    return this.http.get<{ message: string }>(`${this.baseUrl}sells/exportBling/${id}`);
  }

  saveGoals(goals: Goals[]) {
    return this.http.post<{ message: string }>(`${this.baseUrl}sellers/goals`, goals);
  }

  getGoals() {
    return this.http.get<Goals[] | null>(`${this.baseUrl}sellers/goals`);
  }

  getCommissionsReport(fromDate: string, toDate: string) {
    return this.http.get<CommissionsReport[]>(`${this.baseUrl}sellers/commissionsReport?fromDate=${fromDate}${toDate}`);
  }
}
