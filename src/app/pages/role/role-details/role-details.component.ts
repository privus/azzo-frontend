// role-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cargo, Permissao } from 'src/app/modules/account/models/user.model';
import { AzzoService } from '../../../core/services/azzo.service';
import { PERMISOES } from 'src/app/shared/constants/user-constant';

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.scss']
})
export class RoleDetailsComponent implements OnInit {

  role: Cargo;
  permissionsList: Permissao[] = PERMISOES;
  rolePermissions: Permissao[] = [];

  constructor(
    private route: ActivatedRoute,
    private azzoService: AzzoService
  ) { }

  ngOnInit(): void {
    const roleId = +this.route.snapshot.paramMap.get('id')!;
    if (roleId) {
      this.azzoService.getRoleById(roleId).subscribe(
        roleData => {
          if (roleData) {
            this.role = roleData;
            this.rolePermissions = this.getPermissionsFromSoma(roleData.somaPermissao);
          } else {
            console.error('Role não encontrada');
            // Opcional: exibir uma mensagem ao usuário ou redirecionar
          }
        },
        error => {
          console.error('Erro ao buscar os dados da role:', error);
          // Opcional: exibir uma mensagem ao usuário ou redirecionar
        }
      );
    } else {
      console.error('Nenhum ID de role encontrado nos parâmetros de rota');
      // Opcional: exibir uma mensagem ao usuário ou redirecionar
    }
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
