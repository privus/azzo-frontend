import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreditService } from '../services/credit.service';
import { Conta, PCredit, UpdateInstallment } from '../models';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DebtService } from '../services/debt.service';
import { PFormaPagamento } from '../../commerce/models';
import { OrderService } from '../../commerce/services/order.service';

@Component({
  selector: 'app-credit-person-modal',
  templateUrl: './credit-modal-person.component.html',
  styleUrls: ['./credit-modal-person.component.scss'],
})
export class CreditModalPersonComponent implements OnInit {
  @Input() parcelaModel: PCredit;
  @Output() onModalClose: EventEmitter<void> = new EventEmitter();
  userEmail: string = '';
  creditForm: FormGroup;
  obs: string = '';
  showAccountInput: boolean = false;
  accounts: Conta[] = [];
  userCompanyId: number = 0;
  accountSearch: string = '';
  showPaymentM: boolean = false;
  paymentMethods: PFormaPagamento[] = [];

  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  constructor(
    private activeModal: NgbActiveModal,
    private creditService: CreditService,
    private localStorage: LocalStorageService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private debtService: DebtService,
    private orderService: OrderService,
  ) {}

  ngOnInit(): void {
    const storageInfo = this.localStorage.get('STORAGE_MY_INFO');
    this.userEmail = storageInfo ? JSON.parse(storageInfo).email : '';
    this.userCompanyId = storageInfo ? JSON.parse(storageInfo).companyId : 0;
    this.loadAccount();
    this.loadPayment();
    this.initializeForm();
    this.patchFormWithCredit(this.parcelaModel);
  }

  private initializeForm(): void {
    this.creditForm = this.fb.group({
      parcela_id: [{ value: '', disabled: true }],
      nome: [{ value: '', disabled: true }],
      numero: [{ value: '', disabled: true }],
      valor: [{ value: '', disabled: true }],
      valor_total: [''],
      juros: [{ value: '', disabled: true }],
      data_criacao: [{ value: '', disabled: true }],
      data_vencimento: [''],
      status_pagamento: [''],
      data_pagamento: [''],
      data_competencia: [{ value: '', disabled: true }],
      descricao: [{ value: '', disabled: true }],
      categoria: [{ value: '', disabled: true }],
      categoria_nome: [{ value: '', disabled: true }],
      categoria_id: [{ value: '', disabled: true }],
      conta: [{ value: '', disabled: true }],
      criado_por: [{ value: '', disabled: true }],
      atualizado_por: [{ value: '', disabled: true }],
      obs: [''],
      valor_total_pedido: [{ value: '', disabled: true }],
      forma_pagamento_id: [''],
      forma_pagamento_nome: [''],
      conta_id: [''],
      conta_nome: [''],
      cliente: [{ value: '', disabled: true }],
    });
  }

  private patchFormWithCredit(credit: PCredit): void {
    this.creditForm.patchValue({
      parcela_id: credit.parcela_id,
      nome: credit.nome,
      numero: credit.numero,
      valor: credit.valor,
      juros: credit.juros,
      data_criacao: credit.data_criacao,
      data_vencimento: credit.data_vencimento,
      status_pagamento: credit.status_pagamento.status_pagamento_id,
      data_pagamento: credit.data_pagamento,
      data_competencia: credit.data_competencia,
      descricao: credit.descricao,
      categoria: credit.categoria?.nome || '',
      categoria_nome: credit.categoria_nome || '',
      categoria_id: credit.categoria_id,
      conta_id: credit.account?.account_id || '',
      criado_por: credit.criado_por,
      atualizado_por: credit.atualizado_por,
      obs: credit.descricao || '',
      valor_total_pedido: credit.venda ? credit.venda.valor_final : '',
      forma_pagamento_id: credit.venda ? credit.venda.forma_pagamento?.forma_pagamento_id : '',
      cliente: credit.venda ? credit.venda.cliente.nome : '',
    });

    this.obs = credit.descricao || '';
    this.updateFormControls();
  }

  closeModal(): void {
    this.activeModal.dismiss();
  }

  private loadAccount(): void {
    this.debtService.getAccount(this.userCompanyId).subscribe((accounts) => {
      this.accounts = accounts;
      console.log('Accounts loaded:', this.accounts);
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

  onSubmit(): void {
    if (+this.creditForm.get('status_pagamento')?.value === 4 && (!this.obs || this.obs.trim() === '')) {
      this.showAlert({
        icon: 'warning',
        title: 'Justificativa Obrigatória',
        text: 'Por favor, insira uma justificativa para o cancelamento.',
        confirmButtonText: 'Ok',
      });
      return;
    }

    const updateData: UpdateInstallment = {
      parcela_id: this.f.parcela_id.value,
      status_pagamento_id: +this.f?.status_pagamento_id.value,
      data_pagamento: this.f?.data_pagamento.value,
      data_vencimento: this.f?.data_vencimento.value,
      atualizado_por: this.userEmail,
      obs: this.f?.obs.value,
      valor_total: +this.f.valor_total.value,
      venda_id: this.parcelaModel.venda ? +this.parcelaModel.venda.venda_id : undefined,
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
    if (statusId === 2 || statusId === 4) {
      this.creditForm.get('status_pagamento')?.disable();
      this.creditForm.get('data_pagamento')?.disable();
      this.creditForm.get('juros')?.disable();
    }
    if (statusId === 3 || statusId === 4) {
      this.creditForm.get('data_pagamento')?.setValue('');
    }
    if (statusId === 4) {
      this.creditForm.get('obs')?.enable();
    }
  }

  isJustificationRequired(): boolean {
    return +this.f.status_pagamento.value === 4 && (!this.obs || this.obs.trim() === '');
  }

  get documentoLabel(): string {
    return this.parcelaModel?.venda?.cliente?.tipo_doc === 'cnpj' ? 'Cnpj' : 'Cpf';
  }

  toggleAccountInput(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.showAccountInput = value === '';
  }

  onDateChange(): void {
    const dataVencimentoControl = this.f.data_vencimento;

    if (dataVencimentoControl) {
      dataVencimentoControl.markAsDirty(); // Força a marcação como modificado
      dataVencimentoControl.updateValueAndValidity(); // Atualiza a validação do campo
    }
  }

  private loadPayment(): void {
    this.orderService.getAllPaymentMethods().subscribe((payment) => {
      this.paymentMethods = payment;
    });
  }

  togglePayment(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.showPaymentM = value === '';
  }
}
