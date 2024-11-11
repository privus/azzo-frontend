import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListingComponent } from './user-listing/user-listing.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { NewAccountComponent } from './new-account/new-account.component';

const routes: Routes = [
  {
    path: '',
    component: UserListingComponent,
  },
  {
    path: 'new-account',
    component: NewAccountComponent,
  },
  {
    path: ':id',
    component: UserDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
