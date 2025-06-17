import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Conta, ParcelaDebito, UpdateInstallment } from '../models';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DebtService } from '../services/debt.service';

@Component({
  selector: 'app-debt-modal',
  templateUrl: './debt-modal.component.html',
  styleUrls: ['./debt-modal.component.scss'],
})
export class DebtModalComponent implements OnInit {
  @Input() parcelaModel: ParcelaDebito;
  @Output() onModalClose: EventEmitter<void> = new EventEmitter(); // Evento de saída para notificar o fechamento
  userEmail: string = '';
  debtForm: FormGroup; // Add the correct type for your form
  obs: string = '';
  isPaymentDateDisabled: boolean = false;
  userCompanyId: number = 0;
  accounts: Conta[];
  showAccountInput: boolean = false;

  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  today: string = '';

  constructor(
    private activeModal: NgbActiveModal,
    private debtService: DebtService,
    private localStorage: LocalStorageService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {}

  private initializeForm(): void {
    this.debtForm = this.fb.group({
      parcela_id: [{ value: '', disabled: true }],
      numero: [{ value: '', disabled: true }],
      valor: [{ value: '', disabled: true }],
      valor_total: [{ value: '' }],
      data_criacao: [{ value: '', disabled: true }],
      data_vencimento: [{ value: '' }],
      status_pagamento: [{ value: '' }],
      data_pagamento: [{ value: new Date().toISOString().substring(0, 10) }, [Validators.required]],
      data_competencia: [{ value: '', disabled: true }],
      obs: [{ value: '', disabled: true }],
      conta_id: [''],
      conta_nome: [''],
      atualizado_por: [{ value: '', disabled: true }],
    });
  }

  private patchFormWithDebt(debt: ParcelaDebito): void {
    this.debtForm.patchValue({
      parcela_id: debt.parcela_id,
      numero: debt.numero,
      valor: debt.valor,
      juros: debt.juros,
      data_criacao: debt.data_criacao,
      data_vencimento: debt.data_vencimento,
      status_pagamento: debt.status_pagamento.status_pagamento_id,
      data_pagamento: debt.data_pagamento,
      data_competencia: debt.data_competencia,
      conta: debt.account.nome,
      atualizado_por: debt.atualizado_por,
      valor_total: debt.status_pagamento.status_pagamento_id === 2 ? debt.valor : null,
    });
  }

  ngOnInit(): void {
    this.today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const storageInfo = this.localStorage.get('STORAGE_MY_INFO');
    this.userEmail = storageInfo ? JSON.parse(storageInfo).email : '';
    this.userCompanyId = storageInfo ? JSON.parse(storageInfo).companyId : '';
    this.loadAccount();
    this.initializeForm();
    this.patchFormWithDebt(this.parcelaModel);

    if (+this.parcelaModel.status_pagamento.status_pagamento_id === 2) {
      this.debtForm.disable();
    }

    this.disableDateStatus();
    console.log('Parcela:', this.parcelaModel);
  }

  closeModal(): void {
    this.activeModal.dismiss();
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

  onSubmit(): void {
    // Verifica se a justificativa é obrigatória
    if (+this.parcelaModel.status_pagamento.status_pagamento_id === 4 && (!this.obs || this.obs.trim() === '')) {
      this.showAlert({
        icon: 'warning',
        title: 'Justificativa Obrigatória',
        text: 'Por favor, insira uma justificativa para o cancelamento.',
        confirmButtonText: 'Ok',
      });
      return; // Impede o envio do formulário
    }

    let dataPagamentoValue = this.debtForm.get('data_pagamento')?.value;
    if (!dataPagamentoValue || isNaN(Date.parse(dataPagamentoValue))) {
      dataPagamentoValue = null;
    } else {
      // Adiciona um dia à data de pagamento
      const dataPagamento = new Date(dataPagamentoValue);
      dataPagamento.setDate(dataPagamento.getDate() + 1);
      dataPagamentoValue = dataPagamento.toISOString().split('T')[0]; // Formata para 'YYYY-MM-DD'
    }

    const updateData: UpdateInstallment = {
      parcela_id: this.f.parcela_id.value,
      status_pagamento_id: +this.f.status_pagamento.value,
      data_pagamento: dataPagamentoValue,
      valor_total: +this.f.valor_total.value,
      atualizado_por: this.userEmail,
      obs: this.f.obs.value,
      data_vencimento: this.f.data_vencimento.value,
    };

    this.debtService.updateInstallment(updateData).subscribe({
      next: (resp) => {
        this.showAlert(
          {
            icon: 'success',
            title: 'Parcela atualizada com sucesso!',
            text: resp.message,
            confirmButtonText: 'Ok',
          },
          () => {
            this.activeModal.close('success');
            window.location.reload(); // Recarrega a página inteira
          },
        );
      },
      error: (err) => {
        this.showAlert({
          icon: 'error',
          title: 'Erro!',
          text: 'Não foi possível atualizar a parcela.',
          confirmButtonText: 'Ok',
        });
        console.error(err);
      },
    });
  }

  get f() {
    return this.debtForm.controls;
  }

  disableDateStatus(): void {
    if (+this.parcelaModel.status_pagamento.status_pagamento_id === 2) {
      this.f.data_pagamento.disable();
      this.f.status_pagamento.disable();
    }
  }

  isJustificationRequired(): boolean {
    return +this.parcelaModel.status_pagamento.status_pagamento_id === 4 && (!this.obs || this.obs.trim() === '');
  }

  isFormValidForPaidStatus(): boolean {
    if (+this.f.status_pagamento.value !== 2) return true; // Ignora se não for Pago

    // Lista de campos obrigatórios quando status é "Pago"
    const requiredFields = ['valor_total', 'data_pagamento', 'data_vencimento', 'conta'];

    return requiredFields.every((field) => {
      const ctrl = this.f[field];
      return ctrl && ctrl.value !== null && ctrl.value !== '';
    });
  }

  private loadAccount(): void {
    this.debtService.getAccount(this.userCompanyId).subscribe((accounts) => {
      this.accounts = accounts;
      console.log('Accounts loaded:', this.accounts);
    });
  }

  toggleAccountInput(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.showAccountInput = value === '';
  }
}
