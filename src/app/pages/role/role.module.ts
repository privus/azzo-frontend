import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleListingComponent } from './role-listing/role-listing.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { RoleModalComponent } from './role-modal/role-modal.component';

@NgModule({
  declarations: [RoleDetailsComponent, RoleListingComponent, RoleModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: RoleListingComponent,
      },
      {
        path: ':id',
        component: RoleDetailsComponent,
      },
    ]),
    SweetAlert2Module.forChild(),
  ],
})
export class RoleModule {}
