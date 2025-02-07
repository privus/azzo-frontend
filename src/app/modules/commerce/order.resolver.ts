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
    return this.orderService.getAllOrders();
  }
}
