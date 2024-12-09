import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductComponent } from './product.component';
import { ProductResolver } from './product.resolver';

const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    resolve: {
      product: ProductResolver,
    },
    children: [
      {
        path: 'register',
        component: ProductDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
