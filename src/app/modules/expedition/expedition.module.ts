import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpeditionRoutingModule } from './expediton-routing.module';
import { StockProjectionComponent } from './stock-projection/stock-projection.component';
import { FormsModule } from '@angular/forms';
import { ExpeditionService } from './services/expedition.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [StockProjectionComponent],
  imports: [CommonModule, ExpeditionRoutingModule, FormsModule, NgbTooltipModule],
  providers: [ExpeditionService],
})
export class ExpeditionModule {}
