// role-details.component.ts
import { ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cargo, Permissao, Usuario } from '../../../modules/account/models/user.model';
import { AzzoService } from '../../../core/services/azzo.service';
import { PERMISOES } from 'src/app/shared/constants/user-constant';
import { Config } from 'datatables.net';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.scss'],
})
export class RoleDetailsComponent implements OnInit {
  role: Cargo;
  permissionsList: Permissao[] = PERMISOES;
  rolePermissions: Permissao[] = [];
  users: Usuario[] = [];
  datatableConfig: Config = {};
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

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
    this.azzoService.getUsersByRole(roleId).subscribe({
      next: (usersData) => {
        this.users = usersData;
        this.cdr.detectChanges();
        console.log('Usuários da role:', usersData);
      },
      error: (error) => {
        console.error('Erro ao buscar os usuários da role:', error);
      },
    });
  }

  // Method to get permissions from somaPermissao
  getPermissionsFromSoma(somaPermissao: number): Permissao[] {
    return this.permissionsList.filter((p) => (somaPermissao & p.permissao) !== 0);
  }

  getRandomColor(): string {
    const colors = ['success', 'info', 'warning', 'danger'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
