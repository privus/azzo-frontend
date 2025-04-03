import { Injectable } from '@angular/core';
import { SellService } from '../../../core/services';

@Injectable({
  providedIn: 'root',
})
export class SellersService {
  constructor(private readonly sellService: SellService) {}

  getSellsByBrand() {
    return this.sellService.getSellsByBrand();
  }

  getCommissions() {
    return this.sellService.getCommissions();
  }
}
