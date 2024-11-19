// role-details.component.ts
import { ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cargo, Permissao, UserUpdate, Usuario } from '../../../modules/account/models/user.model';
import { AzzoService } from '../../../core/services/azzo.service';
import { PERMISOES } from '../../../shared/constants/user-constant';
import { Config } from 'datatables.net';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { AccountService } from '../../../modules/account/services/account.service';

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
    private accountService: AccountService,
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

  removeRole(user: Usuario): void {
    const updatedUser: Partial<UserUpdate> = { cargo_id: null };

    this.accountService.updateUserInfo(user.usuario_id, updatedUser).subscribe({
      complete: () => {
        // Atualiza a lista de usuários local após a remoção
        this.users = this.users.filter((u) => u.usuario_id !== user.usuario_id);
        this.showAlert({
          icon: 'success',
          title: 'Removido!',
          text: `O usuário ${user.nome} foi removido com sucesso.`,
          showCancelButton: false,
          confirmButtonText: 'Ok',
        });
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao remover o cargo do usuário:', error);
        this.swalOptions = {
          icon: 'error',
          title: 'Erro!',
          text: 'Não foi possível remover o usuário do cargo.',
        };
        this.noticeSwal.fire();
      },
    });
  }

  showAlert(swalOptions: SweetAlertOptions) {
    this.swalOptions = swalOptions;
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }
}
