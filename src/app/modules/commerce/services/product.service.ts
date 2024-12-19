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

  getProductById(id: number) {
    return this.azzoService.getProductByCode(id);
  }
}
