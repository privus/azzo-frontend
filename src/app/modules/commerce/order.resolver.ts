import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { OrderService } from './services/order.service';
import { Pedido } from './models/order.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderResolver implements Resolve<Pedido[] | null> {
  constructor(private orderService: OrderService) {}

  resolve(): Observable<Pedido[] | null> {
    return this.orderService.getAllOrders();
  }
}
