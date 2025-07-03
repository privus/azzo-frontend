import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { OrderService } from './services/order.service';
import { POrder } from './models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class POrderResolver implements Resolve<POrder[] | null> {
  constructor(private orderService: OrderService) {}

  resolve(): Observable<POrder[] | null> {
    const now = new Date();
    const startDate = new Date();
    startDate.setMonth(now.getMonth() - 1);
    const fromDate = this.formatDate(startDate);

    return this.orderService.getOrdersByDateP(fromDate);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
