import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductsListingComponent } from './products-listing/products-listing.component';
import { ProductResolver } from './product.resolver';

const routes: Routes = [
  {
    path: '',
    component: ProductsListingComponent,
    resolve: {
      product: ProductResolver,
    },
  },
  {
    path: ':id',
    component: ProductDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
