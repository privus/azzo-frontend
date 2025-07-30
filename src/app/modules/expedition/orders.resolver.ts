import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { forkJoin, map, Observable } from 'rxjs';
import { OrderService } from '../../modules/commerce/services/order.service';
import { Order } from '../../modules/commerce/models/order.model';
import { AssemblyResponse } from './models';

@Injectable({ providedIn: 'root' })
export class OrdersResolver implements Resolve<{ orders: Order[]; progress: AssemblyResponse[] }> {
  constructor(private orderService: OrderService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<{ orders: Order[]; progress: AssemblyResponse[] }> {
    const q = route.queryParamMap.get('orders') || '';
    const codigos = q
      .split(',')
      .map((s) => Number(s))
      .filter((n) => !isNaN(n));
    // Busca pedidos
    return forkJoin([forkJoin(codigos.map((codigo) => this.orderService.getOrderById(codigo))), this.orderService.getAssemblyProgress(codigos)]).pipe(
      map(([orders, progress]) => ({ orders, progress })),
    );
  }
}
