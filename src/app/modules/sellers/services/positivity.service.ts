import { Injectable } from '@angular/core';

import { SellService } from '../../../core/services';

@Injectable({
  providedIn: 'root',
})
export class PositivityService {
  constructor(private readonly sellService: SellService) {}

  getSellsByBrand() {
    return this.sellService.getSellsByBrand();
  }
}
