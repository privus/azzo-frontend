import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DebtService } from '../../modules/financial/services/debt.service';
import { ComparisonReport } from '../models';

@Injectable({
  providedIn: 'root',
})
export class DebtsComparisonResolver implements Resolve<ComparisonReport> {
  constructor(private debtsService: DebtService) {}

  resolve(): Observable<ComparisonReport> {
    const today = new Date();

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const formattedStart = startOfMonth.toISOString().split('T')[0];
    const formattedToday = today.toISOString().split('T')[0];

    return this.debtsService.getComparisonDebts(formattedStart, formattedToday);
  }
}
