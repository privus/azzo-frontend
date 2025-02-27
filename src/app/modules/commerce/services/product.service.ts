import { Injectable } from '@angular/core';
import { ProductsService } from '../../../core/services/';
import { Produto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private readonly productsService: ProductsService) {}

  getAllProducts() {
    return this.productsService.getProducts();
  }

  getProductById(id: number) {
    return this.productsService.getProductByCode(id);
  }

  updateTinyCodes(productId: number, data: { tiny_mg: number; tiny_sp: number }) {
    return this.productsService.updateTinyCodes(productId, data);
  }
}
