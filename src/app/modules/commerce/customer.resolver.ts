import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Cliente } from './models/costumer.model';
import { CustomerService } from './services/customer.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerResolver implements Resolve<Cliente[] | null> {
  constructor(private customersService: CustomerService) {}

  resolve(): Observable<Cliente[] | null> {
    return this.customersService.getAllCustomers();
  }
}
