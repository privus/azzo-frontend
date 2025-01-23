import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreditsListingComponent } from './credits-listing/credits-listing.component';
import { FinancialRoutingModule } from './financial-routing.module';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CreditsListingComponent],
  imports: [SharedModule, RouterModule, CommonModule, FormsModule, ReactiveFormsModule, FinancialRoutingModule],
})
export class FinancialModule {}
