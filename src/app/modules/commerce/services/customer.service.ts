import { Injectable } from '@angular/core';
import { ClientService } from '../../../core/services/';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private readonly clientService: ClientService) {}

  getAllCustomers() {
    return this.clientService.getCustomers();
  }

  getCustomerByCode(codigo: number) {
    return this.clientService.getCustomerByCode(codigo);
  }

  getStatusHistory(regiao_id: number) {
    return this.clientService.getStatusHistory(regiao_id);
  }
}
