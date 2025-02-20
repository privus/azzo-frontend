import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreditService } from '../services/credit.service';
import { Credit, UpdateInstallment } from '../modal';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-credit-modal',
  templateUrl: './credit-modal.component.html',
  styleUrls: ['./credit-modal.component.scss'],
})
export class CreditModalComponent implements OnInit {
  @Input() parcelaModel: Credit;
  @Output() onModalClose: EventEmitter<void> = new EventEmitter();
  userEmail: string = '';
  creditForm: FormGroup;
  obs: string = '';

  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  constructor(
    private activeModal: NgbActiveModal,
    private creditService: CreditService,
    private localStorage: LocalStorageService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {}

  private initializeForm(): void {
    this.creditForm = this.fb.group({
      parcela_id: [{ value: '', disabled: true }],
      nome: [{ value: '', disabled: true }],
      nome_empresa: [{ value: '', disabled: true }],
      numero: [{ value: '', disabled: true }],
      valor: [{ value: '', disabled: true }],
      juros: [''],
      data_criacao: [{ value: '', disabled: true }],
      data_vencimento: [{ value: '', disabled: true }],
      status_pagamento: [''],
      data_pagamento: [''],
      data_competencia: [{ value: '', disabled: true }],
      categoria: [{ value: '', disabled: true }],
      codigo: [{ value: '', disabled: true }],
      obs: [{ value: '', disabled: true }],
      forma_pagamento: [{ value: '', disabled: true }],
      descricao: [{ value: '', disabled: true }],
      conta: [{ value: '', disabled: true }],
      atualizado_por: [{ value: '', disabled: true }],
    });
  }

  private patchFormWithCredit(credit: Credit): void {
    this.creditForm.patchValue({
      parcela_id: credit.parcela_id,
      nome: credit.nome,
      nome_empresa: credit.venda ? credit.venda.cliente.nome_empresa : '',
      numero: credit.numero,
      valor: credit.valor,
      juros: credit.juros,
      data_criacao: credit.data_criacao,
      data_vencimento: credit.data_vencimento,
      status_pagamento: credit.status_pagamento.status_pagamento_id,
      data_pagamento: credit.data_pagamento,
      data_competencia: credit.data_competencia,
      categoria: credit.categoria?.nome,
      codigo: credit.venda ? credit.venda.codigo : '',
      forma_pagamento: credit.venda ? credit.venda.forma_pagamento : '',
      descricao: credit.descricao,
      conta: credit.conta,
      atualizado_por: credit.atualizado_por,
    });

    this.updateFormControls();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.patchFormWithCredit(this.parcelaModel);
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
    console.log('Data Pagamento:', this.creditForm.get('data_pagamento')?.value);

    if (+this.parcelaModel.status_pagamento.status_pagamento_id === 4 && (!this.obs || this.obs.trim() === '')) {
      this.showAlert({
        icon: 'warning',
        title: 'Justificativa Obrigatória',
        text: 'Por favor, insira uma justificativa para o cancelamento.',
        confirmButtonText: 'Ok',
      });
      return;
    }

    let dataPagamentoValue = this.creditForm.get('data_pagamento')?.value;
    if (!dataPagamentoValue || isNaN(Date.parse(dataPagamentoValue))) {
      dataPagamentoValue = null;
    }

    const updateData: UpdateInstallment = {
      parcela_id: this.f.parcela_id.value,
      status_pagamento_id: +this.f.status_pagamento.value,
      data_pagamento: dataPagamentoValue,
      juros: this.f.juros ? Number(this.f.juros.value) : 0,
      atualizado_por: this.userEmail,
      obs: this.f.obs.value,
    };

    this.creditService.updateInstallment(updateData).subscribe({
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
            window.location.reload();
          },
        );
      },
      error: (err) => {
        this.showAlert({
          icon: 'error',
          title: 'Erro!',
          text: 'Não foi possível atualizar o pedido.',
          confirmButtonText: 'Ok',
        });
        console.error(err);
      },
    });
  }

  get f() {
    return this.creditForm.controls;
  }

  updateFormControls(): void {
    const statusId = +this.creditForm.get('status_pagamento')?.value;
    const statusIdModel = this.parcelaModel.status_pagamento.status_pagamento_id;

    if (statusIdModel === 2 || statusIdModel === 4) {
      this.creditForm.get('status_pagamento')?.disable();
      this.creditForm.get('data_pagamento')?.disable();
      this.creditForm.get('juros')?.disable();
    }

    if (statusId === 3 || statusId === 4) {
      this.creditForm.get('data_pagamento')?.disable();
      this.creditForm.get('data_pagamento')?.setValue('');
    }

    if (statusIdModel === 4) {
      this.creditForm.get('obs')?.disable();
    }
  }

  isJustificationRequired(): boolean {
    return +this.parcelaModel.status_pagamento.status_pagamento_id === 4 && (!this.obs || this.obs.trim() === '');
  }
}
