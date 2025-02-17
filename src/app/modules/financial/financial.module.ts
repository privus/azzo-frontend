import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreditsListingComponent } from './credits-listing/credits-listing.component';
import { FinancialRoutingModule } from './financial-routing.module';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { RouterModule } from '@angular/router';
import { DebtsListingComponent } from './debts-listing/debts-listing.component';
import { CreditModalComponent } from './credit-modal/credit-modal.component';
import { CoreModule } from 'src/app/core/core.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DebtDetailsComponent } from './debt-details/debt-details.component';
import { DebtCreateModalComponent } from './debt-create-modal/debt-create-modal.component';
import { CreditCreateModalComponent } from './credit-create-modal/credit-create-modal.component';

@NgModule({
  declarations: [
    CreditsListingComponent,
    DebtsListingComponent,
    CreditModalComponent,
    DebtDetailsComponent,
    DebtCreateModalComponent,
    CreditCreateModalComponent,
  ],
  imports: [
    SharedModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FinancialRoutingModule,
    CoreModule,
    SweetAlert2Module.forChild(),
  ],
})
export class FinancialModule {}
