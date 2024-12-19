import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductsListingComponent } from './products-listing/products-listing.component';
import { ProductResolver } from './product.resolver';
import { CustomerListingComponent } from './customer-listing/customer-listing.component';
import { CustomerResolver } from './customer.resolver';
import { CustomersDetailsComponent } from './customers-details/customers-details.component';

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
    component: CustomerListingComponent,
    resolve: {
      customers: CustomerResolver,
    },
  },
  {
    path: 'customers/:id',
    component: CustomersDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommerceRoutingModule {}
