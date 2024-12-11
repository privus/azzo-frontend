import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ProductService } from './services/product.service';
import { Produto } from './models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductResolver implements Resolve<Produto[] | null> {
  constructor(private productService: ProductService) {}

  resolve(): Observable<Produto[] | null> {
    return this.productService.getAllProducts();
  }
}
