import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CreditService } from './services/credit.service';
import { Credit } from './models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreditResolver implements Resolve<Credit[] | null> {
  constructor(private creditService: CreditService) {}

  resolve(): Observable<Credit[] | null> {
    return this.creditService.getAllCredits();
  }
}
