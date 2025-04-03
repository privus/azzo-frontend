import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { PositivityService } from './services/positivity.service';
import { BrandSales } from './models/brand-sales.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrandSalesResolver implements Resolve<BrandSales | null> {
  constructor(private positivityService: PositivityService) {}

  resolve(): Observable<BrandSales | null> {
    return this.positivityService.getSellsByBrand();
  }
}
