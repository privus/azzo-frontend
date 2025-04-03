import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PositivityComponent } from './positivity/positivity.component';
import { BrandSalesResolver } from './brand-sales.resolver';

const routes: Routes = [
  {
    path: 'positivity',
    component: PositivityComponent,
    resolve: {
      brandSales: BrandSalesResolver,
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellersRoutingModule {}
