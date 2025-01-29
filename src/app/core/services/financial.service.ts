import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Credito } from '../../modules/financial/modal/credit.modal';
import { Debt, Departamento } from '../../modules/financial/modal/debt.modal';
import { environment } from '../../../environments/environment';

@Injectable()
export class FinancialService {
  private baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getFinancialCredits() {
    return this.http.get<Credito[]>(`${this.baseUrl}credits`);
  }

  getFinancialCreditsByDateRange(fromDate: string, toDate: string) {
    return this.http.get<Credito[]>(`${this.baseUrl}credits/date?fromDate=${fromDate}&toDate=${toDate}`);
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
}
