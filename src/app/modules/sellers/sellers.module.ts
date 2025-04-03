import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PositivityComponent } from './positivity/positivity.component';
import { SellersRoutingModule } from './sellers-routing.module';

@NgModule({
  declarations: [PositivityComponent],
  imports: [CommonModule, SellersRoutingModule],
})
export class SellersModule {}
