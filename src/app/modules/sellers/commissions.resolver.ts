import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { SellersService } from './services/sellers.service';
import { Commissions } from './models/commissions.model';

@Injectable({
  providedIn: 'root',
})
export class CommissionsResolver implements Resolve<Commissions[] | null> {
  constructor(private sellersService: SellersService) {}

  resolve(): Observable<Commissions[] | null> {
    const today = new Date();

    // Primeiro dia do mês atual
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    // Último dia do mês atual
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const formattedStart = start.toISOString().split('T')[0];
    const formattedEnd = end.toISOString().split('T')[0];

    const commissions = this.sellersService.getCommissions(formattedStart, formattedEnd);
    console.log('COMMISSIONS ===> ', commissions);
    return commissions;
  }
}
