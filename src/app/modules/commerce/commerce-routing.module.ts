import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductsListingComponent } from './products-listing/products-listing.component';
import { ProductResolver, CustomerResolver, RankingResolver, OrderResolver, GoalsResolver } from './';
import { CustomerListingComponent } from './customer-listing/customer-listing.component';
import { CustomersDetailsComponent } from './customers-details/customers-details.component';
import { OrderListingComponent } from './order-listing/order-listing.component';
import { OrderDetailsComponent } from './order-details/order-details.component';

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
      meta: GoalsResolver,
    },
  },
  {
    path: 'orders/:id',
    component: OrderDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommerceRoutingModule {}
