import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { ProductRankingItem } from '../../modules/commerce/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductRankingResolver implements Resolve<ProductRankingItem[]> {
  constructor(private productsService: ProductsService) {}

  resolve(): Observable<ProductRankingItem[]> {
    const now = new Date();
    // Current month: 1st to today
    const startCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endCurrentPeriod = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const fromDate = this.formatDate(startCurrentMonth);
    const toDate = this.formatDate(endCurrentPeriod);

    return this.productsService.getProductRanking(fromDate, toDate);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}







