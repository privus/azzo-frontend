import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { OrderService } from './services/order.service';
import { Ranking } from './models/order.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RankingResolver implements Resolve<Ranking | null> {
  constructor(private orderService: OrderService) {}

  resolve(): Observable<Ranking | null> {
    return this.orderService.getSellerRanking();
  }
}
