import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Cargo } from '../../../modules/account/models/user.model';
import { SweetAlertOptions } from 'sweetalert2';
import { RoleService } from '../../../core/services/';
import { Router } from '@angular/router';
import { RoleModalComponent } from '../role-modal/role-modal.component';

@Component({
  selector: 'app-role-listing',
  templateUrl: './role-listing.component.html',
  styleUrls: ['./role-listing.component.scss'],
})
export class RoleListingComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = false;
  cargos: Cargo[] = [];
  cargoModel: Cargo = { cargo_id: 0, nome: '' };
  userCounts: { [key: number]: number } = {};

  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  private modalReference: NgbModalRef;
  private clickListener: () => void;

  constructor(
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private modalService: NgbModal,
    private roleService: RoleService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  ngAfterViewInit(): void {
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = (event.target as HTMLElement).closest('.btn');
      if (closestBtn) {
        const action = closestBtn.getAttribute('data-action');
        const id = closestBtn.getAttribute('data-id');
        switch (action) {
          case 'view':
            this.router.navigate(['/apps/roles', Number(id)]);
            break;
          case 'create':
            this.openRoleModal();
            break;
          case 'edit':
            const cargo = this.cargos.find((c) => c.cargo_id === Number(id));
            this.openRoleModal(cargo);
            break;
        }
      }
    });
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (cargos) => {
        this.cargos = cargos;
        console.log('cargo ========>', this.cargos);
        this.fetchUserCounts();
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading roles:', error),
    });
  }

  fetchUserCounts(): void {
    this.cargos.forEach((role) => {
      this.roleService.getUsersByRole(role.cargo_id).subscribe({
        next: (users) => {
          this.userCounts[role.cargo_id] = users.length;
          this.cdr.detectChanges();
        },
        error: (error) => console.error(`Erro ao buscar usuários para o cargo ${role.nome}:`, error),
      });
    });
  }

  openRoleModal(cargo?: Cargo) {
    this.modalReference = this.modalService.open(RoleModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });

    const modalComponentInstance = this.modalReference.componentInstance as RoleModalComponent;
    modalComponentInstance.cargoModel = cargo ? { ...cargo } : { cargo_id: 0, nome: '' };

    this.modalReference.result.then(
      (updatedCargo: Cargo) => {
        if (updatedCargo) {
          if (updatedCargo.cargo_id > 0) {
            const index = this.cargos.findIndex((c) => c.cargo_id === updatedCargo.cargo_id);
            if (index !== -1) {
              this.cargos[index] = updatedCargo;
            }
          } else {
            this.cargos.push(updatedCargo);
          }
          this.cdr.detectChanges();
          this.loadRoles();
          this.showAlert({
            icon: 'success',
            title: 'Success!',
            text: updatedCargo.cargo_id > 0 ? 'Role updated successfully!' : 'Role created successfully!',
          });
        }
      },
      () => {
        // Modal dismissed, nenhuma ação necessária
      },
    );
  }

  showAlert(swalOptions: SweetAlertOptions) {
    this.swalOptions = swalOptions;
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }

  ngOnDestroy(): void {
    if (this.clickListener) this.clickListener();
    this.modalService.dismissAll();
  }

  deleteRole(role: Cargo): void {
    const confirmOptions: SweetAlertOptions = {
      title: 'Tem certeza?',
      text: 'Esta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar',
    };
    this.swalOptions = confirmOptions;
    this.cdr.detectChanges();

    this.noticeSwal.fire().then((result) => {
      if (result.isConfirmed) {
        this.roleService.deleteRole(role.cargo_id).subscribe({
          next: () => {
            this.cargos = this.cargos.filter((c) => c.cargo_id !== role.cargo_id);
            this.showAlert({
              icon: 'success',
              title: 'Deletado!',
              text: 'O cargo foi deletado com sucesso.',
              showCancelButton: false,
              confirmButtonText: 'Ok',
            });
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Error deleting role:', error);
            this.showAlert({
              icon: 'error',
              title: 'Erro!',
              text: 'Ocorreu um erro ao tentar excluir o cargo.',
            });
          },
        });
      }
    });
  }
}
