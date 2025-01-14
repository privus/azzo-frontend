import { Injectable } from '@angular/core';
import { AzzoService } from '../../../core/services/azzo.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private readonly azzoService: AzzoService) {}

  getAllOrders() {
    return this.azzoService.getAllOrders();
  }
}
