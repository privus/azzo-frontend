import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PositivityComponent } from './positivity/positivity.component';
import { CommissionsComponent } from './commission/commission.component';
import { BrandSalesResolver, CommissionsResolver, PositivityResolver, PositivityAzzoResolver, WeeklyBonusResolver } from './';
import { WeeklyBonusComponent } from './weekly-bonus/weekly-bonus.component';

const routes: Routes = [
  {
    path: 'positivity',
    component: PositivityComponent,
    resolve: {
      brandSales: BrandSalesResolver,
      positivity: PositivityResolver,
      positivityAzzo: PositivityAzzoResolver,
    },
  },
  {
    path: 'commissions',
    component: CommissionsComponent,
    resolve: {
      commissions: CommissionsResolver,
    },
  },
  {
    path: 'weekly-bonus',
    component: WeeklyBonusComponent,
    resolve: {
      bonus: WeeklyBonusResolver,
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellersRoutingModule {}
