import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { SellersService } from './services/sellers.service';
import { PositivityByBrandResponse } from './models';

@Injectable({
  providedIn: 'root',
})
export class PositivityResolver implements Resolve<PositivityByBrandResponse | null> {
  constructor(private sellersService: SellersService) {}

  resolve(): Observable<PositivityByBrandResponse | null> {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 7);
    const now = new Date();
    const formattedNow = now.toISOString().split('T')[0];
    const formatted = fifteenDaysAgo.toISOString().split('T')[0];

    return this.sellersService.getPositivity(formatted, formattedNow);
  }
}
