import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  allowedRoles: string[] = [];
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    this.allowedRoles = route.data['roles'];
    const userRole = this.localStorageService.getRole(); // Ex: 'Administrador', 'Financeiro', 'Expedição'

    if (userRole && this.allowedRoles.includes(userRole)) {
      return true;
    }

    this.router.navigate(['/']); // ou outra página permitida
    return false;
  }
}
