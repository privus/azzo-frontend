import { Injectable } from '@angular/core';
import { SellService } from '../../../core/services';

@Injectable({
  providedIn: 'root',
})
export class SellersService {
  constructor(private readonly sellService: SellService) {}

  getSellsByBrand(fromDate: string, toDate?: string) {
    const to = toDate ? `&toDate=${toDate}` : '';
    return this.sellService.getSellsByBrand(fromDate, to);
  }

  getCommissions() {
    return this.sellService.getCommissions();
  }

  getPositivity(fromDate: string, toDate?: string) {
    const to = toDate ? `&toDate=${toDate}` : '';
    return this.sellService.getPositivity(fromDate, to);
  }
}
