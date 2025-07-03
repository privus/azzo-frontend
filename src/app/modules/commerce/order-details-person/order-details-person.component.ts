import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { Location } from '@angular/common';
import { OrderService } from '../services/order.service';
import { CreditModalPersonComponent } from '../../financial/credit-modal-person/credit-modal-person.component';
import { PCredit, PGenerateCredit } from '../../financial/models';
import { PFormaPagamento, POrder, UpdateSellPerson } from '../models';
import { GenerateInstallmentsModalComponent } from '../generate-installments-modal/generate-installments-modal.component';

@Component({
  selector: 'app-order-details-person',
  templateUrl: './order-details-person.component.html',
  styleUrls: ['./order-details-person.component.scss'],
})
export class OrderDetailsPersonComponent implements OnInit {
  orderForm: FormGroup;
  order: POrder;
  orderId: number;
  code: number;
  showPaymentM: boolean = false;
  paymentMethods: PFormaPagamento[] = [];

  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.loadPayment();
    this.initializeForm();

    this.code = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.code) {
      console.error('Invalid order ID:', this.code);
      return;
    }

    this.orderService.getOrderByIdP(this.code).subscribe({
      next: (order) => {
        this.order = order;
        this.orderId = order.venda_id;
        this.patchFormWithOrder(order);
        this.cdr.detectChanges();
        console.log('Order fetched successfully:', order);
      },
      error: (err) => console.error('Error fetching order:', err),
    });
  }

  private loadPayment(): void {
    this.orderService.getAllPaymentMethods().subscribe((payment) => {
      this.paymentMethods = payment;
    });
  }

  private initializeForm(): void {
    this.orderForm = this.fb.group({
      numero_tiny: [{ value: '', disabled: true }],
      data_criacao: [{ value: '', disabled: true }],
      nome: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      cidade: [{ value: '', disabled: true }],
      doc: [{ value: '', disabled: true }],
      vendedor: [{ value: '', disabled: true }],
      status: [''],
      valor_final: [{ value: '', disabled: true }],
      valor_frete: [''],
      numero_nfe: [''],
      forma_pagamento: [{ value: '', disabled: true }],
      chave_nfe: [{ value: '', disabled: true }],
      data_emissao_nfe: [{ value: '', disabled: true }],
      obs: [{ value: '', disabled: true }],
      venda_id: [{ value: '', disabled: true }],
      status_pagamento: [{ value: '' }],
      forma_pagamento_id: [''],
      forma_pagamento_nome: [''],
    });
  }

  private patchFormWithOrder(order: POrder): void {
    this.orderForm.patchValue({
      numero_tiny: order.numero_tiny ?? order.venda_id,
      data_criacao: order.data_criacao,
      nome: order.cliente.nome,
      cidade: order.cliente.cidade_string,
      doc: order.cliente.numero_doc,
      vendedor: order.vendedor?.nome,
      status: order.status_venda.status_venda_id,
      valor_final: order.valor_final,
      valor_frete: order.valor_frete ?? null,
      numero_nfe: order.numero_nfe,
      forma_pagamento: order.forma_pagamento?.nome,
      chave_nfe: order.chave_acesso,
      data_emissao_nfe: order.data_emissao_nfe,
      obs: order.observacao,
      venda_id: order.venda_id,
      status_pagamento: order.status_pagamento.status_pagamento_id,
      forma_pagamento_id: order.forma_pagamento?.forma_pagamento_id,
    });

    if (order.numero_nfe) this.orderForm.get('numero_nfe')?.disable();
    if (order.valor_frete) this.orderForm.get('valor_frete')?.disable();
  }

  updateStatus(): void {
    const update = this.orderForm.value;

    const payload: UpdateSellPerson = {
      codigo: this.code,
      numero_nfe: update.numero_nfe,
      status_pagamento_id: Number(update.status_pagamento),
      forma_pagamento_id: Number(update.forma_pagamento_id),
      forma_pagamento_nome: update.forma_pagamento_nome || null,
    };

    this.orderService.updateSellStatusP(payload).subscribe({
      next: (resp) =>
        this.showAlert({
          icon: 'success',
          title: 'Pedido atualizado!',
          text: resp.message,
          confirmButtonText: 'Ok',
        }),
      error: (err) =>
        this.showAlert({
          icon: 'error',
          title: 'Erro!',
          text: err.error?.message || 'Falha ao atualizar.',
          confirmButtonText: 'Ok',
        }),
    });
  }

  openCreditModal(parcela: PCredit): void {
    const modalRef = this.modalService.open(CreditModalPersonComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });

    modalRef.componentInstance.parcelaModel = {
      ...parcela,
      venda: this.order,
    };
  }

  showAlert(opts: SweetAlertOptions): void {
    this.swalOptions = opts;
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }

  goBack(): void {
    this.location.back();
  }

  openNfeLink(url: string): void {
    window.open(url, '_blank');
  }

  installmentsGenerator() {
    const modalRef = this.modalService.open(GenerateInstallmentsModalComponent, { size: 'md' });
    modalRef.componentInstance.valorTotal = this.order.valor_final;
    modalRef.componentInstance.dataPedido = this.order.data_criacao;
    modalRef.result.then(
      (parcelas: PGenerateCredit[]) => {
        if (parcelas && parcelas.length) {
          this.orderService.generatorinstallments(this.order.venda_id, parcelas).subscribe({
            next: () => {
              this.cdr.detectChanges();
              this.showAlert({ icon: 'success', title: 'Parcelas geradas!', text: 'Parcelas cadastradas com sucesso.', confirmButtonText: 'Ok' });
              window.location.reload();
            },
            error: (err) =>
              this.showAlert({ icon: 'error', title: 'Erro!', text: err?.error?.message || 'Falha ao gerar parcelas.', confirmButtonText: 'Ok' }),
          });
        }
      },
      () => {},
    );
  }

  togglePayment(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.showPaymentM = value === '';
  }
}
