import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PositivityComponent } from './positivity/positivity.component';
import { CommissionsComponent } from './commission/commission.component';
import { BrandSalesResolver } from './brand-sales.resolver';
import { CommissionsResolver } from './commissions.resolver';
import { PositivityResolver } from './positivity.resolver';

const routes: Routes = [
  {
    path: 'positivity',
    component: PositivityComponent,
    resolve: {
      brandSales: BrandSalesResolver,
      positivity: PositivityResolver,
    },
  },
  {
    path: 'commissions',
    component: CommissionsComponent,
    resolve: {
      commissions: CommissionsResolver,
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellersRoutingModule {}
