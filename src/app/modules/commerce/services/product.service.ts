import { Injectable } from '@angular/core';
import { ItemService } from '../../../core/services/';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private readonly itemService: ItemService) {}

  getAllProducts() {
    return this.itemService.getProducts();
  }

  getProductById(id: number) {
    return this.itemService.getProductByCode(id);
  }
}
