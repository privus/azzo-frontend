import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockProjectionComponent } from './stock-projection/stock-projection.component';
import { StockProjectionResolver } from './stock-projection.resolver';
import { RomaneioComponent } from './romaneio/romaneio.component';
import { RomaneioResolver } from './romaneio.resolver';
import { StockComponent } from './stock/stock.component';
import { ProductResolver } from '../commerce/product.resolver';
// import { StockLiquidResolver } from './stock-liquid.resolver';

const routes: Routes = [
  {
    path: 'stock',
    component: StockComponent,
    resolve: {
      product: ProductResolver,
      // stockLiquid: StockLiquidResolver,
    },
  },
  {
    path: 'stock-projection',
    component: StockProjectionComponent,
    resolve: {
      stockProjection: StockProjectionResolver,
    },
  },
  {
    path: 'romaneio',
    component: RomaneioComponent,
    resolve: {
      romaneio: RomaneioResolver,
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpeditionRoutingModule {}
