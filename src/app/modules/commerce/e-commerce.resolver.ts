import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Ecommerce } from './models';
import { Observable } from 'rxjs';
import { OrderService } from './services/order.service';

@Injectable({
  providedIn: 'root',
})
export class EcommerceResolver implements Resolve<Ecommerce[]> {
  constructor(private orderService: OrderService) {}
  resolve(): Observable<Ecommerce[]> {
    return this.orderService.getAllOrdersEcommerce();
  }
}
