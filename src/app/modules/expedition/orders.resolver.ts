// orders.resolver.ts
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { OrderService } from '../../modules/commerce/services/order.service';
import { Order } from '../../modules/commerce/models/order.model';

@Injectable({ providedIn: 'root' })
export class OrdersResolver implements Resolve<Order[]> {
  constructor(private orderService: OrderService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<Order[]> {
    const q = route.queryParamMap.get('orders') || '';
    const codigos = q
      .split(',')
      .map((s) => Number(s))
      .filter((n) => !isNaN(n));
    // Se backend suportar múltiplos de uma vez, chame sua API direta.
    return forkJoin(codigos.map((codigo) => this.orderService.getOrderById(codigo)));
  }
}
