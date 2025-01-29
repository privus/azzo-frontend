import { Component, Input, OnInit } from '@angular/core';
import { Cargo, Permissao } from '../../../modules/account/models/user.model';
import { RoleService } from '../../../core/services/';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.scss'],
})
export class RoleModalComponent implements OnInit {
  @Input() cargoModel: Cargo = { cargo_id: 0, nome: '', cargoPermissoes: [] };
  permissionsList: Permissao[] = [];
  permissionStates: { [key: number]: { ler: boolean; editar: boolean; criar: boolean } } = {};

  isAdmin: boolean = false;

  constructor(
    private roleService: RoleService,
    public activeModal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    // Inicializa permissões carregando da API
    this.roleService.getPermissions().subscribe((permissions: Permissao[]) => {
      this.permissionsList = permissions;
      this.initializePermissionStates();
    });
  }

  initializePermissionStates(): void {
    // Marca todas as permissões como desmarcadas inicialmente
    this.permissionsList.forEach((perm) => {
      this.permissionStates[perm.permissao_id] = { ler: false, editar: false, criar: false };
    });

    // Atualiza com base nas permissões do cargo
    if (this.cargoModel?.cargoPermissoes) {
      this.cargoModel.cargoPermissoes.forEach((perm) => {
        if (perm.permissao?.permissao_id !== undefined) {
          this.permissionStates[perm.permissao.permissao_id] = {
            ler: perm.ler === 1,
            editar: perm.editar === 1,
            criar: perm.criar === 1,
          };
        }
      });
    }

    // Verifica se o usuário é 'Administrador' com base nas permissões atuais
    this.checkIfAdminSelected();
  }

  onAdminChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;
    this.isAdmin = isChecked;

    // Atualiza todas as permissões
    this.permissionsList.forEach((perm) => {
      this.permissionStates[perm.permissao_id] = {
        ler: isChecked,
        editar: isChecked,
        criar: isChecked,
      };
    });
  }

  onPermissionChange(event: Event, permissionId: number, type: 'ler' | 'editar' | 'criar'): void {
    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;

    if (this.permissionStates[permissionId]) {
      // Atualiza o estado do checkbox que foi alterado
      this.permissionStates[permissionId][type] = isChecked;

      if (type === 'criar') {
        if (isChecked) {
          // Se 'Criar' for marcado, 'Editar' e 'Ler' também são marcados
          this.permissionStates[permissionId]['editar'] = true;
          this.permissionStates[permissionId]['ler'] = true;
        }
      }

      if (type === 'editar') {
        if (isChecked) {
          // Se 'Editar' for marcado, 'Ler' também é marcado
          this.permissionStates[permissionId]['ler'] = true;
        } else {
          // Se 'Editar' for desmarcado
          if (this.permissionStates[permissionId]['criar']) {
            // Não permite desmarcar 'Editar' se 'Criar' estiver marcado
            setTimeout(() => {
              this.permissionStates[permissionId]['editar'] = true;
              input.checked = true;
            }, 0);
          }
        }
      }

      if (type === 'ler') {
        if (!isChecked) {
          // Se 'Ler' for desmarcado
          if (this.permissionStates[permissionId]['editar'] || this.permissionStates[permissionId]['criar']) {
            // Não permite desmarcar 'Ler' se 'Editar' ou 'Criar' estiverem marcados
            setTimeout(() => {
              this.permissionStates[permissionId]['ler'] = true;
              input.checked = true;
            }, 0);
          }
        }
      }

      // Atualiza o estado do checkbox 'Administrador'
      this.checkIfAdminSelected();
    }
  }

  checkIfAdminSelected(): void {
    const allSelected = this.permissionsList.every(
      (perm) =>
        this.permissionStates[perm.permissao_id].ler &&
        this.permissionStates[perm.permissao_id].editar &&
        this.permissionStates[perm.permissao_id].criar,
    );
    this.isAdmin = allSelected;
  }

  onSubmit() {
    // Filtra as permissões com pelo menos uma ação selecionada
    const permissoes = Object.keys(this.permissionStates)
      .map((key) => ({
        permissao_id: Number(key),
        ler: this.permissionStates[Number(key)].ler ? 1 : 0,
        editar: this.permissionStates[Number(key)].editar ? 1 : 0,
        criar: this.permissionStates[Number(key)].criar ? 1 : 0,
      }))
      .filter((perm) => perm.ler === 1 || perm.editar === 1 || perm.criar === 1);

    const payload = {
      nome: this.cargoModel.nome,
      permissoes,
    };
    console.log('payload', payload);

    if (this.cargoModel.cargo_id > 0) {
      this.roleService.updateRole(this.cargoModel.cargo_id, payload).subscribe(() => {
        this.activeModal.close(this.cargoModel);
      });
    } else {
      this.roleService.createRole(payload).subscribe((newCargo: Cargo) => {
        this.activeModal.close(newCargo);
      });
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }
}
