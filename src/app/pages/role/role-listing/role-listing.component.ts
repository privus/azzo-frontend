import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Cargo, Permissao } from '../../../modules/account/models/user.model';
import { PERMISOES } from '../../../shared/constants/user-constant';
import { SweetAlertOptions } from 'sweetalert2';
import { AzzoService } from '../../../core/services/azzo.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-listing',
  templateUrl: './role-listing.component.html',
  styleUrls: ['./role-listing.component.scss']
})
export class RoleListingComponent implements OnInit, AfterViewInit, OnDestroy {

  isLoading = false;
  cargos: Cargo[] = [];
  permissionsList: Permissao[] = PERMISOES;

  // Single model for create/edit
  cargoModel: Cargo = { cargo_id: 0, nome: '', somaPermissao: 0 };

  @ViewChild('formModal') formModal: TemplateRef<any>;
  private modalReference: NgbModalRef;

  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  modalConfig: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg',
    modalDialogClass: 'modal-dialog-centered',
  };

  private clickListener: () => void;

  constructor(
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private modalService: NgbModal,
    private azzoService: AzzoService,
    private router: Router
  ) { }

ngAfterViewInit(): void {
  this.clickListener = this.renderer.listen(document, 'click', (event) => {
    const closestBtn = event.target.closest('.btn');
    if (closestBtn) {
      const { action, id } = closestBtn.dataset;

      switch (action) {
        case 'view':
          const roleId = Number(id);
          this.router.navigate(['/apps/roles', roleId]); // Navigate to the role details route with ID
          break;

          case 'create':
            this.create();
            this.modalReference = this.modalService.open(this.formModal, this.modalConfig);
            break;

          case 'edit':
            this.edit(Number(id));
            this.modalReference = this.modalService.open(this.formModal, this.modalConfig);
            break;

          case 'delete':
            this.delete();
            break;
        }
      }
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.azzoService.getRoles().subscribe({
      next: (cargos) => {
        this.cargos = cargos;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading roles:', error);
      }
    });
  }

  delete: () => void;

  edit(id: number) {
    const cargo = this.cargos.find(c => c.cargo_id === id);
    if (cargo) {
      // Clone the cargo to avoid direct mutations
      this.cargoModel = { ...cargo };
    }
  }

  create() {
    // Reset the cargo model for new entry
    this.cargoModel = { cargo_id: 0, nome: '', somaPermissao: 0 };
  }

  onSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      return;
    }

    this.isLoading = true;

    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Success!',
      text: this.cargoModel.cargo_id > 0 ? 'Role updated successfully!' : 'Role created successfully!',
    };

    const errorAlert: SweetAlertOptions = {
      icon: 'error',
      title: 'Error!',
      text: '',
    };

    if (this.cargoModel.cargo_id > 0) {
      // Update existing role
      this.azzoService.updateRole(this.cargoModel.cargo_id, this.cargoModel).subscribe({
        next: (updatedCargo) => {
          // Update the role in the local array
          const index = this.cargos.findIndex(c => c.cargo_id === updatedCargo.cargo_id);
          if (index !== -1) {
            this.cargos[index] = updatedCargo;
          }
          this.showAlert(successAlert);
          this.modalReference.close();
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          errorAlert.text = error.error?.message || 'Failed to update role.';
          this.showAlert(errorAlert);
          this.isLoading = false;
          console.error('Error updating role:', error);
        }
      });
    } else {
      // Create new role
      this.azzoService.createRole(this.cargoModel).subscribe({
        next: (newCargo) => {
          // Add the new role to the local array
          this.cargos.push(newCargo);
          this.showAlert(successAlert);
          this.modalReference.close();
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          errorAlert.text = error.error?.message || 'Failed to create role.';
          this.showAlert(errorAlert);
          this.isLoading = false;
          console.error('Error creating role:', error);
        }
      });
    }
  }

  showAlert(swalOptions: SweetAlertOptions) {
    let style = swalOptions.icon?.toString() || 'success';
    if (swalOptions.icon === 'error') {
      style = 'danger';
    }
    this.swalOptions = Object.assign({
      buttonsStyling: false,
      confirmButtonText: "Ok, got it!",
      customClass: {
        confirmButton: "btn btn-" + style
      }
    }, swalOptions);
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.modalService.dismissAll();
  }

  // Method to get permissions from somaPermissao
  getPermissionsFromSoma(somaPermissao: number): Permissao[] {
    return this.permissionsList.filter((p) => (somaPermissao & p.permissao) !== 0);
  }

  // Method to check if a permission is assigned to the cargoModel
  hasPermission(permissao: Permissao): boolean {
    return (this.cargoModel.somaPermissao & permissao.permissao) !== 0;
  }

  // Method to toggle a permission in cargoModel
  togglePermission(permissao: Permissao): void {
    if (this.hasPermission(permissao)) {
      // Remove permission
      this.cargoModel.somaPermissao -= permissao.permissao;
    } else {
      // Add permission
      this.cargoModel.somaPermissao += permissao.permissao;
    }
  }
}
