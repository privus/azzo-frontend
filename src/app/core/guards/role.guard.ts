import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const cargo = this.localStorageService.getRole();
    if (cargo === 'Desenvolvedor') {
      return true;
    } else {
      this.router.navigate(['/']); // Redireciona para a página inicial ou outra página permitida
      return false;
    }
  }
}
