import { Component, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { Cargo, Permissao } from '../../../modules/account/models/user.model';
import { NgForm } from '@angular/forms';
import { AzzoService } from '../../../core/services/azzo.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.scss'],
})
export class RoleModalComponent implements OnInit {
  @Input() cargoModel: Cargo;
  @Input() permissionsList: Permissao[];
  isLoading = false;
  errorMessage = '';
  isAdminSelected = false;

  constructor(
    private azzoService: AzzoService,
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    // Inicializa o estado do checkbox "Administrador"
    this.isAdminSelected = this.hasPermission(this.getAdminPermission());
  }

  // Obtém a permissão "Administrador"
  getAdminPermission(): Permissao {
    return this.permissionsList.find((perm) => perm.nome === 'Administrador')!;
  }

  // Verifica se uma permissão específica está ativa
  hasPermission(permissao: Permissao): boolean {
    return (this.cargoModel.somaPermissao & permissao.permissao) !== 0;
  }

  // Alterna uma permissão específica
  togglePermission(permissao: Permissao): void {
    if (permissao.nome === 'Administrador') {
      // Alterna todas as permissões
      if (this.hasPermission(permissao)) {
        // Desativa "Administrador" e todas as permissões
        this.cargoModel.somaPermissao = 0;
        this.isAdminSelected = false;
      } else {
        // Ativa "Administrador" e todas as permissões
        this.cargoModel.somaPermissao = this.permissionsList.reduce((acc, perm) => acc | perm.permissao, 0);
        this.isAdminSelected = true;
      }
    } else {
      if (this.hasPermission(permissao)) {
        // Desativa a permissão
        this.cargoModel.somaPermissao &= ~permissao.permissao;
      } else {
        // Ativa a permissão
        this.cargoModel.somaPermissao |= permissao.permissao;
      }
      // Atualiza o estado do "Administrador"
      const allPermissionsExceptAdmin = this.permissionsList.filter((perm) => perm.nome !== 'Administrador');
      const allPermissionsSelected = allPermissionsExceptAdmin.every((perm) => this.hasPermission(perm));
      if (allPermissionsSelected) {
        // Ativa "Administrador"
        this.cargoModel.somaPermissao |= this.getAdminPermission().permissao;
        this.isAdminSelected = true;
      } else {
        // Desativa "Administrador"
        this.cargoModel.somaPermissao &= ~this.getAdminPermission().permissao;
        this.isAdminSelected = false;
      }
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;
    this.isLoading = true;
    this.errorMessage = '';

    const action$ =
      this.cargoModel.cargo_id > 0
        ? this.azzoService.updateRole(this.cargoModel.cargo_id, this.cargoModel)
        : this.azzoService.createRole(this.cargoModel);

    action$.subscribe({
      next: (responseCargo) => {
        this.isLoading = false;
        this.activeModal.close(responseCargo);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Falha ao processar o cargo.';
        console.error('Error processing role:', error);
        this.cdr.detectChanges();
      },
    });
  }

  closeModal() {
    this.activeModal.dismiss();
  }
}
