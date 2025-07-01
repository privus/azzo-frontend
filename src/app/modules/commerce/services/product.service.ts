import { Injectable } from '@angular/core';
import { ProductsService } from '../../../core/services/';
import { UpdatedProduct } from '../models';

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

  updateProduct(productId: number, data: UpdatedProduct) {
    return this.productsService.updateProduct(productId, data);
  }
}
