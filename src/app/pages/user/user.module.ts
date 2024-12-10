import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListingComponent } from './user-listing/user-listing.component';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { NgbCollapseModule, NgbDropdownModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NewAccountComponent } from './new-account/new-account.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserRoutingModule } from './user-routing.module';
import { UserEditModal } from './user-edit-modal/user-edit-modal.component';
import { NgxMaskDirective } from 'ngx-mask';

@NgModule({
  declarations: [UserListingComponent, NewAccountComponent, UserEditModal],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule,
    SharedModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    SweetAlert2Module.forChild(),
    MatAutocompleteModule,
    MatInputModule,
    MatProgressSpinnerModule,
    NgxMaskDirective,
  ],
})
export class UserModule {}
