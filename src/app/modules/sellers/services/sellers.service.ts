import { Injectable } from '@angular/core';
import { SellService } from '../../../core/services';
import { Goals } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SellersService {
  constructor(private readonly sellService: SellService) {}

  getSellsByBrand(fromDate: string, toDate?: string) {
    const to = toDate ? `&toDate=${toDate}` : '';
    return this.sellService.getSellsByBrand(fromDate, to);
  }

  getCommissions(fromDate: string, toDate?: string) {
    const to = toDate ? `&toDate=${toDate}` : '';
    return this.sellService.getCommissions(fromDate, to);
  }

  getPositivity(fromDate: string, toDate?: string) {
    const to = toDate ? `&toDate=${toDate}` : '';
    return this.sellService.getPositivity(fromDate, to);
  }

  getPositivityAzzo(fromDate: string, toDate?: string) {
    const to = toDate ? `&toDate=${toDate}` : '';
    return this.sellService.getPositivityAzzo(fromDate, to);
  }

  getWeeklyBonus(fromDate: string, toDate: string) {
    return this.sellService.getWeeklyBonus(fromDate, toDate);
  }

  saveGoals(goals: Goals[]) {
    return this.sellService.saveGoals(goals);
  }

  getGoals() {
    return this.sellService.getGoals();
  }
}
