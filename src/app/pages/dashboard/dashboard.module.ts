import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ModalsModule } from '../../_metronic/partials';
import { AuthGuard } from '../../core/guards/auth.guard';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StatusRecordeResolver, ProductRankingResolver, StatusAnalyticsResolver, StatusByRegionResolver, SalesAzzoComparisonResolver } from './';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
        resolve: {
          salesAzzoPerformance: SalesAzzoComparisonResolver,
          statusAnalytics: StatusAnalyticsResolver,
          statusByRegion: StatusByRegionResolver,
          productRanking: ProductRankingResolver,
          statusRecord: StatusRecordeResolver,
        },
        canActivate: [AuthGuard],
      },
    ]),
    ModalsModule,
  ],
})
export class DashboardModule {}
