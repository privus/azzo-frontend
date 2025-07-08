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
    let thisMonth = new Date();

    const f = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1);
    const to = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 0);
    to.setDate(to.getDate() + 1);

    const formattedF = f.toISOString().split('T')[0];
    const formattedTo = to.toISOString().split('T')[0];

    return this.debtsService.getComparisonDebts(formattedF, formattedTo);
  }
}
