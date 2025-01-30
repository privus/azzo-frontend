import { Injectable } from '@angular/core';
import { FinancialService } from '../../../core/services/';
import { UpdateInstallment } from '../modal';

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

  UpdateInstallment(UpdateInstallment: UpdateInstallment) {
    return this.finacialService.updateInstallment(UpdateInstallment);
  }
}
