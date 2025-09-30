import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PositivityComponent } from './positivity/positivity.component';
import { SellersRoutingModule } from './sellers-routing.module';
import { CommissionsComponent } from './commission/commission.component';
import { WeeklyBonusComponent } from './weekly-bonus/weekly-bonus.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoalsModalComponent } from './goals-modal/goals-modal.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [PositivityComponent, CommissionsComponent, WeeklyBonusComponent, GoalsModalComponent],
  imports: [CommonModule, SellersRoutingModule, FormsModule, ReactiveFormsModule, CurrencyMaskModule, SweetAlert2Module],
  providers: [CurrencyPipe],
})
export class SellersModule {}
