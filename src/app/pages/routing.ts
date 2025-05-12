import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'builder',
    loadChildren: () => import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'crafted/account',
    loadChildren: () => import('../modules/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'apps/users',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'apps/roles',
    loadChildren: () => import('./role/role.module').then((m) => m.RoleModule),
  },
  {
    path: 'commerce',
    loadChildren: () => import('../modules/commerce/commerce.module').then((m) => m.CommerceModule),
  },
  {
    path: 'financial',
    loadChildren: () => import('../modules/financial/financial.module').then((m) => m.FinancialModule),
  },
  {
    path: 'sellers',
    loadChildren: () => import('../modules/sellers/sellers.module').then((m) => m.SellersModule),
  },
  {
    path: 'expediton',
    loadChildren: () => import('../modules/expedition/expedition.module').then((m) => m.ExpeditionModule),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
