import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductsListingComponent } from './products-listing/products-listing.component';
import { ProductResolver } from './product.resolver';
import { CustomerListingComponent } from './customer-listing/customer-listing.component';
import { CustomerResolver } from './customer.resolver';
import { CustomersDetailsComponent } from './customers-details/customers-details.component';
import { OrderListingComponent } from './order-listing/order-listing.component';
import { OrderResolver } from './order.resolver';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { RankingResolver } from './ranking.resolver';
import { POrderResolver } from './p-order.resolver';
import { OrderListingPersonComponent } from './order-listing-person/order-listing-person.component';
import { OrderDetailsPersonComponent } from './order-details-person/order-details-person.component';

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
  {
    path: 'orders',
    component: OrderListingComponent,
    resolve: {
      orders: OrderResolver,
      ranking: RankingResolver,
    },
  },
  {
    path: 'orders-person',
    component: OrderListingPersonComponent,
    resolve: {
      orders: POrderResolver,
    },
  },
  {
    path: 'orders/:id',
    component: OrderDetailsComponent,
  },
  {
    path: 'orders-person/:id',
    component: OrderDetailsPersonComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommerceRoutingModule {}
