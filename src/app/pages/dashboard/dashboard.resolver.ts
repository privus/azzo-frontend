import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { OrderService } from '../../modules/commerce/services/order.service';
import { Observable } from 'rxjs';
import { SalesComparisonReport } from '../models/performance.modal';

@Injectable({
  providedIn: 'root',
})
export class DashboardResolver implements Resolve<SalesComparisonReport> {
  constructor(private orderService: OrderService) {}

  resolve(): Observable<SalesComparisonReport> {
    const now = new Date();

    // Current month: 1st to today
    const startCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endCurrentPeriod = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    endCurrentPeriod.setDate(endCurrentPeriod.getDate() + 1);

    // Last month: 1st to same day as today
    const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    endLastMonth.setDate(endLastMonth.getDate() + 1);

    const fromDate1 = this.formatDate(startLastMonth);
    const toDate1 = this.formatDate(endLastMonth);
    const fromDate2 = this.formatDate(startCurrentMonth);
    const toDate2 = this.formatDate(endCurrentPeriod);

    return this.orderService.getPerformanceSales(fromDate1, toDate1, fromDate2, toDate2);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
