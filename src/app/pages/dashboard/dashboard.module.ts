import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ModalsModule } from '../../_metronic/partials';
import { AuthGuard } from '../../core/guards/auth.guard';
import { SalesAzzoComparisonResolver } from './sales-azzo-comparison.resolver';
import { DebtsAzzoComparisonResolver } from './debts-azzo-comparison.resolver';
import { DebtsPersonComparisonResolver } from './debts-person-comparison.resolver';
import { FormsModule } from '@angular/forms';
import { DebtsComparisonResolver } from './debts-comparison.resolver';
import { StatusAnalyticsResolver } from './status-analytics.resolver';
import { CustomerResolver } from '../../modules/commerce/customer.resolver';
import { ProductRankingResolver } from './product-ranking.resolver';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
          debtsAzzoPerformance: DebtsAzzoComparisonResolver,
          debtsPersonPerformance: DebtsPersonComparisonResolver,
          debtsComparison: DebtsComparisonResolver,
          statusAnalytics: StatusAnalyticsResolver,
          customers: CustomerResolver,
          productRanking: ProductRankingResolver,
        },
        canActivate: [AuthGuard],
      },
    ]),
    ModalsModule,
  ],
})
export class DashboardModule {}
