import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ClientService,
  FinancialService,
  ProductsService,
  LocalStorageService,
  LoginService,
  PaginationService,
  RoleService,
  SellService,
  SharedService,
  UserService,
  LogisticsService,
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
    ProductsService,
    LoginService,
    PaginationService,
    RoleService,
    SellService,
    SharedService,
    UserService,
    ClientService,
    FinancialService,
    LogisticsService,
  ],
  imports: [CommonModule],
})
export class CoreModule {}
