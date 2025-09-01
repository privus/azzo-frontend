import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PositivityComponent } from './positivity/positivity.component';
import { SellersRoutingModule } from './sellers-routing.module';
import { CommissionsComponent } from './commission/commission.component';
import { WeeklyBonusComponent } from './weekly-bonus/weekly-bonus.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PositivityComponent, CommissionsComponent, WeeklyBonusComponent],
  imports: [CommonModule, SellersRoutingModule, FormsModule],
  providers: [CurrencyPipe],
})
export class SellersModule {}
