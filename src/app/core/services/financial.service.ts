import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  UpdateInstallment,
  Debt,
  Departamento,
  Credit,
  Categoria,
  NewDebt,
  NewCredit,
  UpdateDebtStatus,
  Conta,
} from '../../modules/financial/models';
import { DebtsComparisonReport } from '../../pages/models/performance-debts.model';
import { ComparisonReport } from '../../pages/models';

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

  getDebtsBetweenDates(companyId: number, startDate: string, endDate?: string) {
    console.log(`${this.baseUrl}debts/between?fromDate=${startDate}${endDate}`);
    return this.http.get<Debt[]>(`${this.baseUrl}debts/between?company=${companyId}&fromDate=${startDate}${endDate}`);
  }

  getAllDebts(companyId: number) {
    return this.http.get<Debt[]>(`${this.baseUrl}debts?company=${companyId}`);
  }

  getDebtsFromDate(companyId: number, fromDate: string) {
    return this.http.get<Debt[]>(`${this.baseUrl}debts?company=${companyId}&fromDate=${fromDate}`);
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

  performanceDebts(company_id: number, fromDate1: string, toDate1: string, fromDate2: string, toDate2: string) {
    return this.http.get<DebtsComparisonReport>(
      `${this.baseUrl}debts/debtsReport?fromDate1=${fromDate1}&toDate1=${toDate1}&fromDate2=${fromDate2}&toDate2=${toDate2}&company=${company_id}`,
    );
  }

  getAccount(company_id: number) {
    return this.http.get<Conta[]>(`${this.baseUrl}debts/accounts/${company_id}`);
  }

  getComparisonDebts(fromDate: string, toDate: string) {
    return this.http.get<ComparisonReport>(`${this.baseUrl}debts/balance?fromDate=${fromDate}&toDate=${toDate}`);
  }

  deleteDebt(id: number) {
    return this.http.delete<{ message: string }>(`${this.baseUrl}debts/${id}`);
  }
}
