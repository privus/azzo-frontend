import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditsListingComponent } from './credits-listing/credits-listing.component';
import { CreditResolver } from './credit.resolver';

const routes: Routes = [
  {
    path: 'credits',
    component: CreditsListingComponent,
    resolve: { credits: CreditResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialRoutingModule {}
