import { ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cargo, Usuario } from '../../../modules/account/models/user.model';
import { AzzoService } from '../../../core/services/azzo.service';
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
  users: Usuario[] = [];
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

    this.loadRoleDetails(roleId);
    this.loadUsersByRole(roleId);
  }

  private loadRoleDetails(roleId: number): void {
    this.azzoService.getRoleById(roleId).subscribe({
      next: (roleData) => {
        this.role = roleData;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao buscar os dados da role:', error);
      },
    });
  }

  private loadUsersByRole(roleId: number): void {
    this.azzoService.getUsersByRole(roleId).subscribe({
      next: (usersData) => {
        this.users = usersData;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao buscar os usuários da role:', error);
      },
    });
  }

  removeRole(user: Usuario): void {
    const updatedUser = { cargo_id: null };

    this.accountService.updateUserInfo(user.usuario_id, updatedUser).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.usuario_id !== user.usuario_id);
        this.showAlert({
          icon: 'success',
          title: 'Removido!',
          text: `O usuário ${user.nome} foi removido com sucesso.`,
        });
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao remover o cargo do usuário:', error);
        this.showAlert({
          icon: 'error',
          title: 'Erro!',
          text: 'Não foi possível remover o usuário do cargo.',
        });
      },
    });
  }

  showAlert(swalOptions: SweetAlertOptions): void {
    this.swalOptions = swalOptions;
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }
}
