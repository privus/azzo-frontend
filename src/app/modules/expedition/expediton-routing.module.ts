import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockProjectionComponent } from './stock-projection/stock-projection.component';
import { StockProjectionResolver } from './stock-projection.resolver';

const routes: Routes = [
  {
    path: 'stock-projection',
    component: StockProjectionComponent,
    resolve: {
      stockProjection: StockProjectionResolver,
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpeditionRoutingModule {}
