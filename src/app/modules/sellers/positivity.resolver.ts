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
    return this.sellersService.getPositivity();
  }
}
