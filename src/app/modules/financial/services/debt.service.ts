import { UpdateDebtStatus } from './../modal/debt.modal';
import { UpdateInstallment } from './../modal/update-installment.model';
import { Injectable } from '@angular/core';
import { FinancialService } from '../../../core/services/';
import { NewDebt } from '../modal';

@Injectable({
  providedIn: 'root',
})
export class DebtService {
  constructor(private readonly financialService: FinancialService) {}

  getAllDebts() {
    return this.financialService.getAllDebts();
  }

  getDebtsBetweenDates(startDate: string, endDate?: string) {
    const end = endDate ? `&toDate=${endDate}` : '';
    return this.financialService.getDebtsBetweenDates(startDate, end);
  }

  getDebtsFromDate(fromDate: string) {
    return this.financialService.getDebtsFromDate(fromDate);
  }

  getAllDepartaments() {
    return this.financialService.getAllDeparments();
  }

  getAllCategories() {
    return this.financialService.getAllCategories();
  }

  getDebtById(id: number) {
    return this.financialService.getDebtById(id);
  }

  createDebt(debt: NewDebt) {
    return this.financialService.createDebt(debt);
  }

  updateInstallment(updateInstallment: UpdateInstallment) {
    return this.financialService.updateInstallmentDebt(updateInstallment);
  }

  updateStatusDebt(updateDebtStatus: UpdateDebtStatus) {
    return this.financialService.updateStatusDebt(updateDebtStatus);
  }
}
