import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DebtService } from './services/debt.service';
import { Debt } from './models';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../../../app/core/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class DebtResolver implements Resolve<Debt[] | null> {
  userEmail: string = '';
  userCompanyId: number = 0;
  constructor(
    private debtService: DebtService,
    private localStorage: LocalStorageService,
  ) {}

  resolve(): Observable<Debt[] | null> {
    const storageInfo = this.localStorage.get('STORAGE_MY_INFO');
    this.userCompanyId = storageInfo ? JSON.parse(storageInfo).companyId : '';
    return this.debtService.getAllDebts(this.userCompanyId);
  }
}
