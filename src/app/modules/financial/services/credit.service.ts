import { Injectable } from '@angular/core';
import { FinancialService } from '../../../core/services/';
import { NewCredit, UpdateInstallment } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CreditService {
  constructor(private readonly finacialService: FinancialService) {}

  getAllCredits() {
    return this.finacialService.getFinancialCredits();
  }

  getCreditsByDateRange(start: string, end: string) {
    return this.finacialService.getFinancialCreditsByDateRange(start, end);
  }

  updateInstallment(UpdateInstallment: UpdateInstallment) {
    return this.finacialService.updateInstallmentCredit(UpdateInstallment);
  }

  getAllCategories() {
    return this.finacialService.getAllCategoriesCredits();
  }

  createCredit(newCredit: NewCredit) {
    return this.finacialService.createCredit(newCredit);
  }
}
