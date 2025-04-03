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
    return this.sellersService.getSellsByBrand();
  }
}
