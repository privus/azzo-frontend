import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { SellersService } from './services/sellers.service';
import { VendedorPositivacao } from './models';

@Injectable({
  providedIn: 'root',
})
export class PositivityAzzoResolver implements Resolve<VendedorPositivacao> {
  constructor(private sellersService: SellersService) {}

  resolve(): Observable<VendedorPositivacao> {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 7);
    const now = new Date();
    const formattedNow = now.toISOString().split('T')[0];
    const formatted = fifteenDaysAgo.toISOString().split('T')[0];

    return this.sellersService.getPositivityAzzo(formatted, formattedNow);
  }
}
