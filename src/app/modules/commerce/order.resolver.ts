import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { OrderService } from './services/order.service';
import { Order } from './models/order.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderResolver implements Resolve<Order[] | null> {
  constructor(private orderService: OrderService) {}

  resolve(): Observable<Order[] | null> {
    const now = new Date();
    const startDate = new Date();
    startDate.setMonth(now.getMonth() - 1);
    const fromDate = this.formatDate(startDate);

    return this.orderService.getOrdersByDate(fromDate);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
