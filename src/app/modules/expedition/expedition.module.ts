import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpeditionRoutingModule } from './expediton-routing.module';
import { StockProjectionComponent } from './stock-projection/stock-projection.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpeditionService } from './services/expedition.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RomaneioComponent } from './romaneio/romaneio.component';
import { RomaneioCreateModalComponent } from './romaneio-create-modal/romaneio-create-modal.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { StockComponent } from './stock/stock.component';

@NgModule({
  declarations: [StockProjectionComponent, RomaneioComponent, RomaneioCreateModalComponent, StockComponent],
  imports: [CommonModule, ExpeditionRoutingModule, FormsModule, NgbTooltipModule, ReactiveFormsModule, SweetAlert2Module.forChild()],
  providers: [ExpeditionService],
})
export class ExpeditionModule {}
