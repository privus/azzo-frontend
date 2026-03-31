import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { OrderService } from '../../modules/commerce/services/order.service';
import { Observable } from 'rxjs';
import { SalesComparisonReport } from '../models/performance-sales.modal';

@Injectable({
  providedIn: 'root',
})
export class SalesAzzoComparisonResolver implements Resolve<SalesComparisonReport> {
  constructor(private orderService: OrderService) {}

  resolve(): Observable<SalesComparisonReport> {
    const now = new Date();

    // Current month: 1st to today (inclusive)
    const startCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endCurrentPeriod = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const startLastYear = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    const endLastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    const fromDate1 = this.formatDate(startLastYear);
    const toDate1 = this.formatDate(endLastYear);
    const fromDate2 = this.formatDate(startCurrentMonth);
    const toDate2 = this.formatDate(endCurrentPeriod);

    console.log('fromDate1', fromDate1);
    console.log('toDate1', toDate1);
    console.log('fromDate2', fromDate2);
    console.log('toDate2', toDate2);

    return this.orderService.getPerformanceSales(fromDate1, toDate1, fromDate2, toDate2);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
