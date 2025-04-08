import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PositivityComponent } from './positivity/positivity.component';
import { SellersRoutingModule } from './sellers-routing.module';
import { CommissionsComponent } from './commission/commission.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PositivityComponent, CommissionsComponent],
  imports: [CommonModule, SellersRoutingModule, FormsModule],
})
export class SellersModule {}
