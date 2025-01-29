import { Injectable } from '@angular/core';
import { FinancialService } from '../../../core/services/';

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
}
