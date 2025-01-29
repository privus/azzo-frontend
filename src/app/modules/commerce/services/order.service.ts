import { Injectable } from '@angular/core';
import { SellService } from '../../../core/services/';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private readonly sellService: SellService) {}

  getAllOrders() {
    return this.sellService.getAllOrders();
  }

  getOrderById(id: number) {
    return this.sellService.getOrderById(id);
  }

  getOrdersByDate(fromDate: string) {
    return this.sellService.getOrdersByDate(fromDate);
  }

  syncroAllOrders() {
    return this.sellService.syncroAllOrders();
  }
}
