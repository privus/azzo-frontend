import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UpdateInstallment, Debt, Departamento, Credit } from '../../modules/financial/modal';

@Injectable()
export class FinancialService {
  private baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getFinancialCredits() {
    return this.http.get<Credit[]>(`${this.baseUrl}credits`);
  }

  getFinancialCreditsByDateRange(fromDate: string, toDate: string) {
    return this.http.get<Credit[]>(`${this.baseUrl}credits/date?fromDate=${fromDate}&toDate=${toDate}`);
  }

  getFinancialDebts() {
    return this.http.get<Debt[]>(`${this.baseUrl}debts`);
  }

  getAllDeparments() {
    return this.http.get<Departamento[]>(`${this.baseUrl}debts/departments`);
  }

  getAllCategories() {
    return this.http.get<any[]>(`${this.baseUrl}debts/categories`);
  }

  updateInstallment(UpdateInstallment: UpdateInstallment) {
    return this.http.patch<{ message: string }>(`${this.baseUrl}credits/installment`, UpdateInstallment);
  }
}
