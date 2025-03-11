import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ParcelaDebito, UpdateInstallment } from '../modal';
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

  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

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
      juros: [{ value: '', disabled: true }],
      data_criacao: [{ value: '', disabled: true }],
      data_vencimento: [{ value: '', disabled: true }],
      status_pagamento: [{ value: '' }],
      data_pagamento: [{ value: new Date().toISOString().substring(0, 10) }, [Validators.required]],
      data_competencia: [{ value: '', disabled: true }],
      obs: [{ value: '', disabled: true }],
      conta: [{ value: '' }],
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
      conta: debt.conta,
      atualizado_por: debt.atualizado_por,
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.patchFormWithDebt(this.parcelaModel);
    this.disableDateStatus();
    console.log('Parcela:', this.parcelaModel);
    const storageInfo = this.localStorage.get('STORAGE_MY_INFO');
    this.userEmail = storageInfo ? JSON.parse(storageInfo).email : '';
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
    }

    const updateData: UpdateInstallment = {
      parcela_id: this.f.parcela_id.value,
      status_pagamento_id: +this.f.status_pagamento.value,
      data_pagamento: dataPagamentoValue,
      valor_total: this.f.juros ? Number(this.f.juros.value) : 0,
      atualizado_por: this.userEmail,
      obs: this.f.obs.value,
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
}
