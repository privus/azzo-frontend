import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PositivityComponent } from './positivity/positivity.component';
import { CommissionsComponent } from './commission/commission.component';
import { BrandSalesResolver } from './brand-sales.resolver';
import { CommissionsResolver } from './commissions.resolver';

const routes: Routes = [
  {
    path: 'positivity',
    component: PositivityComponent,
    resolve: {
      brandSales: BrandSalesResolver,
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
