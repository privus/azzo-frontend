import { Injectable } from '@angular/core';
import { AzzoService } from '../../../core/services/azzo.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private readonly azzoService: AzzoService) {}

  getAllCustomers() {
    return this.azzoService.getCustomers();
  }

  getCustomerByCode(codigo: number) {
    return this.azzoService.getCustomerByCode(codigo);
  }
}
