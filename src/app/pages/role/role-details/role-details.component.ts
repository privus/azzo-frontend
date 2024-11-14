// role-details.component.ts
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cargo, Permissao } from 'src/app/modules/account/models/user.model';
import { AzzoService } from '../../../core/services/azzo.service';
import { PERMISOES } from 'src/app/shared/constants/user-constant';

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.scss'],
})
export class RoleDetailsComponent implements OnInit {
  role: Cargo;
  permissionsList: Permissao[] = PERMISOES;
  rolePermissions: Permissao[] = [];
  constructor(
    private route: ActivatedRoute,
    private azzoService: AzzoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const roleId = Number(this.route.snapshot.paramMap.get('id'));
    if (!roleId) {
      console.error('Nenhum ID de role encontrado nos parâmetros de rota');
      return;
    }

    this.azzoService.getRoleById(roleId).subscribe({
      next: (roleData) => {
        this.role = roleData;
        this.rolePermissions = this.getPermissionsFromSoma(roleData.somaPermissao);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao buscar os dados da role:', error);
      },
    });
  }

  // Method to get permissions from somaPermissao
  getPermissionsFromSoma(somaPermissao: number): Permissao[] {
    return this.permissionsList.filter((p) => (somaPermissao & p.permissao) !== 0);
  }

  // Method to handle edit role action
  editRole(): void {
    // Implement role editing logic here
    // For example, open a modal to edit the role
  }
}
