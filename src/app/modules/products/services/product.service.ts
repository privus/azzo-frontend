import { Injectable } from '@angular/core';
import { AzzoService } from '../../../core/services/azzo.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private readonly azzoService: AzzoService) {}

  getAllProducts() {
    return this.azzoService.getProducts();
  }

  getProductByCode(codigo: number) {
    return this.azzoService.getProductByCode(codigo);
  }
}
