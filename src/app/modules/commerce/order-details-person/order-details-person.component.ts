import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { Location } from '@angular/common';
import { OrderService } from '../services/order.service';
import { CreditModalComponent } from '../../financial/credit-modal/credit-modal.component';
import { Credit } from '../../financial/models';
import { POrder, UpdateSellStatus } from '../models';

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

  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  private modalReference!: NgbModalRef;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private location: Location,
  ) {}

  ngOnInit(): void {
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
      },
      error: (err) => console.error('Error fetching order:', err),
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
    });

    if (order.numero_nfe) this.orderForm.get('numero_nfe')?.disable();
    if (order.valor_frete) this.orderForm.get('valor_frete')?.disable();
  }

  updateStatus(): void {
    const nfe = this.orderForm.get('numero_nfe')?.value;

    const payload: UpdateSellStatus = {
      codigo: this.code,
      numero_nfe: nfe,
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

  openCreditModal(parcela: Credit): void {
    const modalRef = this.modalService.open(CreditModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });

    /** passa cópia para o modal */
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
}
