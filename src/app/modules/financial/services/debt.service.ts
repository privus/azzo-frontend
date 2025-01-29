import { Injectable } from '@angular/core';
import { FinancialService } from '../../../core/services/';

@Injectable({
  providedIn: 'root',
})
export class DebtService {
  constructor(private readonly financialService: FinancialService) {}

  getAllDebts() {
    return this.financialService.getFinancialDebts();
  }

  getAllDepartaments() {
    return this.financialService.getAllDeparments();
  }

  getAllCategories() {
    return this.financialService.getAllCategories();
  }
}
