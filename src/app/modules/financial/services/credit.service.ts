import { Injectable } from '@angular/core';
import { AzzoService } from '../../../core/services/azzo.service';

@Injectable({
  providedIn: 'root',
})
export class CreditService {
  constructor(private readonly azzoService: AzzoService) {}

  getAllCredits() {
    return this.azzoService.getFinancialCredits();
  }
}
