import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PositivityComponent } from './positivity/positivity.component';
import { SellersRoutingModule } from './sellers-routing.module';
import { CommissionsComponent } from './commission/commission.component';

@NgModule({
  declarations: [PositivityComponent, CommissionsComponent],
  imports: [CommonModule, SellersRoutingModule],
})
export class SellersModule {}
