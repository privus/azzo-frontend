import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UpdateInstallment, Debt, Departamento, Credit, Categoria, NewDebt, NewCredit, UpdateDebtStatus } from '../../modules/financial/modal';

@Injectable()
export class FinancialService {
  private baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getFinancialCredits() {
    return this.http.get<Credit[]>(`${this.baseUrl}credits`);
  }

  getFinancialCreditsByDateRange(fromDate: string, toDate?: string) {
    return this.http.get<Credit[]>(`${this.baseUrl}credits/date?fromDate=${fromDate}&toDate=${toDate}`);
  }

  getDebtsBetweenDates(startDate: string, endDate?: string) {
    console.log(`${this.baseUrl}debts/between?fromDate=${startDate}${endDate}`);
    return this.http.get<Debt[]>(`${this.baseUrl}debts/between?fromDate=${startDate}${endDate}`);
  }

  getAllDebts() {
    return this.http.get<Debt[]>(`${this.baseUrl}debts`);
  }

  getDebtsFromDate(fromDate: string) {
    return this.http.get<Debt[]>(`${this.baseUrl}debts?fromDate=${fromDate}`);
  }

  getAllDeparments() {
    return this.http.get<Departamento[]>(`${this.baseUrl}debts/departments`);
  }

  getAllCategories() {
    return this.http.get<Categoria[]>(`${this.baseUrl}debts/categories`);
  }

  updateInstallmentCredit(UpdateInstallment: UpdateInstallment) {
    return this.http.patch<{ message: string }>(`${this.baseUrl}credits/installment`, UpdateInstallment);
  }

  updateInstallmentDebt(UpdateInstallment: UpdateInstallment) {
    return this.http.patch<{ message: string }>(`${this.baseUrl}debts/installment`, UpdateInstallment);
  }

  getDebtById(id: number) {
    return this.http.get<Debt>(`${this.baseUrl}debts/${id}`);
  }

  createDebt(debt: NewDebt) {
    return this.http.post<Debt>(`${this.baseUrl}debts`, debt);
  }

  getAllCategoriesCredits() {
    return this.http.get<Categoria[]>(`${this.baseUrl}credits/categories`);
  }

  createCredit(newCredit: NewCredit) {
    return this.http.post<Credit>(`${this.baseUrl}credits`, newCredit);
  }

  updateStatusDebt(updateDebtStatus: UpdateDebtStatus) {
    return this.http.patch<{ message: string }>(`${this.baseUrl}debts/status`, updateDebtStatus);
  }
}
