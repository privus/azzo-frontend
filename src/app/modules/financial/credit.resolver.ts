import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CreditService } from './services/credit.service';
import { Credito } from './modal/credit.modal';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreditResolver implements Resolve<Credito[] | null> {
  constructor(private creditService: CreditService) {}

  resolve(): Observable<Credito[] | null> {
    return this.creditService.getAllCredits();
  }
}
