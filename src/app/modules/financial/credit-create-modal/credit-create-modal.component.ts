import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Categoria, Departamento, NewCredit } from '../models';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { CreditService } from '../services/credit.service';

@Component({
  selector: 'app-debt-credit-modal',
  templateUrl: './credit-create-modal.component.html',
  styleUrls: ['./credit-create-modal.component.scss'],
})
export class CreditCreateModalComponent implements OnInit {
  creditForm: FormGroup;
  departments: Departamento[];
  categories: Categoria[];
  userEmail: string = '';
  showCategoryInput: boolean = false;
  showDepartmentInput: boolean = false;
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  public currencyOptions = {
    prefix: 'R$ ',
    thousands: '.',
    decimal: ',',
    allowNegative: false,
    align: 'left',
  };

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private creditService: CreditService,
    private localStorage: LocalStorageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const storageInfo = this.localStorage.get('STORAGE_MY_INFO');
    this.userEmail = storageInfo ? JSON.parse(storageInfo).email : '';
    this.initializeForm();
    this.loadCategories();
  }

  private loadCategories(): void {
    this.creditService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
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
    this.creditForm = this.fb.group(
      {
        nome: ['', [Validators.required]],
        data_vencimento: [new Date().toISOString().substring(0, 10), [Validators.required]],
        conta: ['', [Validators.required]],
        data_competencia: [new Date().toISOString().substring(0, 10), [Validators.required]],
        data_pagamento: [''],
        pagamento_efetuado: [false],
        descricao: [''],
        valor: [null, [Validators.required, Validators.min(0.01)]],
        categoria_id: [''],
        categoria_nome: [''],
      },
      { validators: this.validCatDep as any },
    );
  }

  submitForm() {
    console.log('Form:', this.creditForm);
    if (this.creditForm.valid) {
      const newCredit = this.creditForm.value;
      const formattedCredit: NewCredit = {
        nome: newCredit.nome,
        descricao: newCredit.descricao,
        data_competencia: newCredit.data_competencia,
        categoria_id: Number(newCredit.categoria_id),
        categoria_nome: newCredit.categoria_nome || null,
        data_pagamento: newCredit.data_pagamento || null,
        data_vencimento: newCredit.data_vencimento,
        conta: newCredit.conta,
        valor: Number(newCredit.valor),
        atualizado_por: this.userEmail,
      };
      console.log('Formatted debt:', formattedCredit);
      this.creditService.createCredit(formattedCredit).subscribe({
        next: () => {
          this.showAlert(
            {
              icon: 'success',
              title: 'Receita criado com sucesso!',
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
            text: 'Não foi possível criar a receita.',
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

  validCatDep(group: FormGroup) {
    const category_id = group.get('categoria_id')?.value || null;
    const category_nome = group.get('categoria_nome')?.value || null;

    if (!category_id && !category_nome) {
      return { validCatDep: true };
    }
    return null;
  }
}
