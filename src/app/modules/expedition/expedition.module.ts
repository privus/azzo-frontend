import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpeditionRoutingModule } from './expediton-routing.module';
import { StockProjectionComponent } from './stock-projection/stock-projection.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpeditionService } from './services/expedition.service';
import { NgbTooltipModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { RomaneioComponent } from './romaneio/romaneio.component';
import { RomaneioCreateModalComponent } from './romaneio-create-modal/romaneio-create-modal.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { StockComponent } from './stock/stock.component';
import { ImportXmlModalComponent } from './import-xml-modal/import-xml-modal.component';
import { StockOutModalComponent } from './stock-out-modal/stock-out-modal.component';

@NgModule({
  declarations: [
    StockProjectionComponent,
    RomaneioComponent,
    RomaneioCreateModalComponent,
    StockComponent,
    ImportXmlModalComponent,
    StockOutModalComponent,
  ],
  imports: [CommonModule, ExpeditionRoutingModule, FormsModule, NgbTooltipModule, ReactiveFormsModule, SweetAlert2Module.forChild(), NgbCarouselModule],
  providers: [ExpeditionService],
})
export class ExpeditionModule {}
