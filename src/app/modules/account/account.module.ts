import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { OverviewComponent } from './overview/overview.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { DropdownMenusModule } from '../../_metronic/partials';
import {SharedModule} from "../../_metronic/shared/shared.module";
import { AccountService } from './services/account.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { RemoveCurrentCargoPipe } from 'src/app/shared/pipes/remove-current-cargo.pipe';

@NgModule({
  providers: [AccountService, provideNgxMask()],
  declarations: [
    AccountComponent,
    OverviewComponent,
    SettingsComponent,
    ProfileDetailsComponent,
    RemoveCurrentCargoPipe,
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    DropdownMenusModule,
    SharedModule,    
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatProgressSpinnerModule,
    NgxMaskDirective, 
  ]
})
export class AccountModule {}
