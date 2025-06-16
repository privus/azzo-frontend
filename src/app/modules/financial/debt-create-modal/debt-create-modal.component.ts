import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DebtService } from '../services/debt.service';
import { Categoria, Conta, Departamento, NewDebt } from '../models';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-debt-create-modal',
  templateUrl: './debt-create-modal.component.html',
  styleUrls: ['./debt-create-modal.component.scss'],
})
export class DebtCreateModalComponent implements OnInit {
  debtForm: FormGroup;
  departments: Departamento[];
  categories: Categoria[];
  accounts: Conta[];
  userEmail: string = '';
  showCategoryInput: boolean = false;
  showDepartmentInput: boolean = false;
  showAccountInput: boolean = false;
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  userCompanyId: number = 0;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private debtService: DebtService,
    private localStorage: LocalStorageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const storageInfo = this.localStorage.get('STORAGE_MY_INFO');
    this.userCompanyId = storageInfo ? JSON.parse(storageInfo).companyId : '';
    this.userEmail = storageInfo ? JSON.parse(storageInfo).email : '';
    this.initializeForm();
    this.loadDepartments();
    this.loadCategories();
    this.loadAccount();
  }

  private loadDepartments(): void {
    this.debtService.getAllDepartaments().subscribe((department) => {
      this.departments = department;
    });
  }

  private loadCategories(): void {
    this.debtService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  private loadAccount(): void {
    this.debtService.getAccount(this.userCompanyId).subscribe((accounts) => {
      this.accounts = accounts;
    });
  }

  showAlert(swalOptions: SweetAlertOptions, callback?: () => void) {
    this.swalOptions = swalOptions;
    this.cdr.detectChanges();
    this.noticeSwal.fire().then(() => {
      if (callback) {
        callback();
      }
    });
  }

  initializeForm() {
    this.debtForm = this.fb.group(
      {
        nome: ['', [Validators.required]],
        data_vencimento: [new Date().toISOString().substring(0, 10), [Validators.required]],
        conta_id: [''],
        conta_nome: [''],
        empresa_id: ['', [Validators.required]],
        numero_parcelas: [1, [Validators.min(1)]],
        data_competencia: [new Date().toISOString().substring(0, 10), [Validators.required]],
        data_pagamento: [''],
        pagamento_efetuado: [false],
        descricao: [''],
        valor_total: [null, [Validators.required, Validators.min(0.01)]],
        juros: [null, [Validators.min(0)]],
        categoria_id: [''],
        categoria_nome: [''],
        departamento_id: [''],
        departamento_nome: [''],
        pagamento_recorrente: [false],
        periodicidade: [null],
      },
      { validators: this.validCatDep as any },
    );
  }

  submitForm() {
    if (this.debtForm.valid) {
      const newDebt = this.debtForm.value;
      console.log('New debt:', newDebt);
      const formattedDebt: NewDebt = {
        nome: newDebt.nome,
        descricao: newDebt.descricao,
        data_competencia: new Date(new Date(newDebt.data_competencia).getTime() + 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
        categoria_id: Number(newDebt.categoria_id),
        categoria_nome: newDebt.categoria_nome || null,
        data_pagamento: newDebt.data_pagamento || null,
        data_vencimento: newDebt.data_vencimento,
        departamento_id: Number(newDebt.departamento_id),
        departamento_nome: newDebt.departamento_nome || null,
        despesa_grupo: Number(newDebt.grupo),
        juros: Number(newDebt.juros),
        numero_parcelas: Number(newDebt.numero_parcelas),
        periodicidade: Number(newDebt.periodicidade),
        valor_total: Number(newDebt.valor_total),
        criado_por: this.userEmail,
        account_id: Number(newDebt.conta_id),
        account_name: newDebt.conta_nome || null,
        company_id: Number(newDebt.empresa_id),
        user_company_id: this.userCompanyId,
      };
      console.log('Formatted debt:', formattedDebt);
      this.debtService.createDebt(formattedDebt).subscribe({
        next: () => {
          this.showAlert(
            {
              icon: 'success',
              title: 'Despesa criado com sucesso!',
              text: '',
              confirmButtonText: 'Ok',
            },
            () => {
              this.activeModal.close('success');
              window.location.reload();
            },
          );
        },
        error: (err) => {
          this.showAlert({
            icon: 'error',
            title: 'Erro!',
            text: 'Não foi possível criar a despesa.',
            confirmButtonText: 'Ok',
          });
          console.error(err);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  toggleCategoryInput(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.showCategoryInput = value === '';
  }

  toggleDepartmentInput(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.showDepartmentInput = value === '';
  }

  toggleAccountInput(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.showAccountInput = value === '';
  }

  validCatDep(group: FormGroup) {
    const category_id = group.get('categoria_id')?.value || null;
    const category_nome = group.get('categoria_nome')?.value || null;
    const departament_id = group.get('departamento_id')?.value || null;
    const departament_nome = group.get('departamento_nome')?.value || null;
    const conta_id = group.get('conta_id')?.value || null;
    const conta_nome = group.get('conta_nome')?.value || null;

    if ((!category_id && !category_nome) || (!departament_id && !departament_nome) || (!conta_id && !conta_nome)) {
      return { validCatDep: true };
    }
    return null;
  }
}
