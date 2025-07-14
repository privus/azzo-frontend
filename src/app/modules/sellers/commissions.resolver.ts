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
    let thisMonth = new Date();

    // Data inicial: primeiro dia do mês anterior
    const f = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1, 1);
    // Data final: último dia do mês anterior
    const to = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 0);

    const formattedF = f.toISOString().split('T')[0];
    const formattedTo = to.toISOString().split('T')[0];
    return this.sellersService.getCommissions(formattedF, formattedTo);
  }
}
