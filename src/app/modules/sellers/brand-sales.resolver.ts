import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { SellersService } from './services/sellers.service';
import { BrandSales } from './models/brand-sales.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrandSalesResolver implements Resolve<BrandSales | null> {
  constructor(private sellersService: SellersService) {}

  resolve(): Observable<BrandSales | null> {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    const now = new Date();
    const formattedNow = now.toISOString().split('T')[0];
    const formatted = fifteenDaysAgo.toISOString().split('T')[0];
    return this.sellersService.getSellsByBrand(formatted, formattedNow);
  }
}
