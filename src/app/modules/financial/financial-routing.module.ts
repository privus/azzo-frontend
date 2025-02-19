import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditsListingComponent } from './credits-listing/credits-listing.component';
import { CreditResolver } from './credit.resolver';
import { DebtsListingComponent } from './debts-listing/debts-listing.component';
import { DebtResolver } from './debt.resolver';
import { DebtDetailsComponent } from './debt-details/debt-details.component';

const routes: Routes = [
  {
    path: 'credits',
    component: CreditsListingComponent,
    resolve: { credits: CreditResolver },
  },
  {
    path: 'debts',
    component: DebtsListingComponent,
    resolve: { debts: DebtResolver },
  },
  {
    path: 'debts/:id',
    component: DebtDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialRoutingModule {}
