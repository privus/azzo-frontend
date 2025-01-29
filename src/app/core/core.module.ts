import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ClientService,
  FinancialService,
  ItemService,
  LocalStorageService,
  LoginService,
  PaginationService,
  RoleService,
  SellService,
  SharedService,
  UserService,
} from './services/';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    LocalStorageService,
    ItemService,
    LoginService,
    PaginationService,
    RoleService,
    SellService,
    SharedService,
    UserService,
    ClientService,
    FinancialService,
  ],
  imports: [CommonModule],
})
export class CoreModule {}
