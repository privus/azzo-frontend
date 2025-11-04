import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockProjectionComponent } from './stock-projection/stock-projection.component';
import { StockProjectionResolver, RomaneioResolver, StockOverviewResolver, OrdersResolver, NfsResumeResolver } from './';
import { RomaneioComponent } from './romaneio/romaneio.component';
import { StockComponent } from './stock/stock.component';
import { ProductResolver } from '../commerce/product.resolver';
import { OrderAssemblyComponent } from './order-assembly/order-assembly.component';
import { AssemblyShellComponent } from './assembly-shell.component/assembly-shell.component';
import { ImportedXmlComponent } from './imported-xml/imported-xml.component';

const routes: Routes = [
  {
    path: 'stock',
    component: StockComponent,
    resolve: {
      product: ProductResolver,
      stockOverview: StockOverviewResolver,
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
  {
    path: 'assembly',
    component: AssemblyShellComponent,
    resolve: { orders: OrdersResolver },
    children: [
      { path: ':step', component: OrderAssemblyComponent },
      { path: '', redirectTo: '1', pathMatch: 'full' },
    ],
  },
  {
    path: 'imported-xml',
    component: ImportedXmlComponent,
    resolve: {
      nfsResume: NfsResumeResolver,
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpeditionRoutingModule {}
