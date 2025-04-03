import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DebtService } from './services/debt.service';
import { Debt } from './models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DebtResolver implements Resolve<Debt[] | null> {
  constructor(private debtService: DebtService) {}

  resolve(): Observable<Debt[] | null> {
    return this.debtService.getAllDebts();
  }
}
