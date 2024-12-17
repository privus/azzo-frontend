import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductsListingComponent } from './products-listing/products-listing.component';
import { ProductResolver } from './product.resolver';
import { CostumerComponent } from './customer/costumer.component';

const routes: Routes = [
  {
    path: 'products',
    component: ProductsListingComponent,
    resolve: {
      product: ProductResolver,
    },
  },
  {
    path: 'products/:id',
    component: ProductDetailsComponent,
  },
  {
    path: 'customers',
    component: CostumerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommerceRoutingModule {}
