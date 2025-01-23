import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ModalsModule } from '../../_metronic/partials';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
    ]),
    ModalsModule,
  ],
})
export class DashboardModule {}
