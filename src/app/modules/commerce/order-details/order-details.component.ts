import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../services/order.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Order } from '../models/order.model';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CreditModalComponent } from '../../financial/credit-modal/credit-modal.component';
import { Credit } from '../../financial/modal';
import { Location } from '@angular/common';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  orderForm: FormGroup;
  order: Order;
  orderId: number;
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  private modalReference: NgbModalRef;

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

    this.orderId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.orderId) {
      this.orderService.getOrderById(this.orderId).subscribe({
        next: (order) => {
          this.order = order;
          console.log('Order ===> ', this.order);
          this.cdr.detectChanges();
          this.patchFormWithOrder(order);
        },
        error: (err) => {
          console.error('Error fetching order:', err);
        },
      });
    } else {
      console.error('Invalid order ID:', this.orderId);
    }
  }

  showAlert(swalOptions: SweetAlertOptions) {
    this.swalOptions = swalOptions;
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }

  private initializeForm(): void {
    this.orderForm = this.fb.group({
      codigo: [{ value: '', disabled: true }],
      nome_empresa: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      telefone: [{ value: '', disabled: true }],
      data: [{ value: '', disabled: true }],
      status: [{ value: '' }],
      valor_final: [{ value: '', disabled: true }],
      produtos: [{ value: '', disabled: true }],
      vendedor: [{ value: '', disabled: true }],
      parcelas: [{ value: '', disabled: true }],
      data_criacao: [{ value: '', disabled: true }],
      cnpj: [{ value: '', disabled: true }],
      metodo: [{ value: '', disabled: true }],
    });
  }

  private patchFormWithOrder(order: Order): void {
    this.orderForm.patchValue({
      codigo: order.codigo,
      data_criacao: order.data_criacao,
      nome_empresa: order.cliente.nome_empresa || order.cliente.nome,
      email: order.cliente.email,
      telefone: order.cliente.celular || order.cliente.telefone_comercial,
      status: order.status_venda.status_venda_id,
      valor_final: order.valor_final,
      vendedor: order.vendedor.nome,
      cnpj: order.cliente.numero_doc,
      metodo: order.metodo_pagamento,
    });
  }

  updateStatus(): void {
    const statusControl = this.orderForm.get('status');
    const status = statusControl ? statusControl.value : null;
    console.log('Updating status:', status);

    this.orderService.updateSellStatus({ venda_id: this.orderId, status_venda_id: Number(status) }).subscribe({
      next: (resp) => {
        this.showAlert({
          icon: 'success',
          title: 'Pedido atualizado com sucesso!',
          text: resp.message,
          confirmButtonText: 'Ok',
        });
        this.cdr.detectChanges();
      },
      error: (resp) => {
        console.error('❌ Erro ao exportar pedido:', resp);

        // Exibir mensagem corretamente no frontend
        this.showAlert({
          icon: 'error',
          title: 'Erro na Exportação!',
          text: resp.message,
          confirmButtonText: 'Corrigir',
        });

        this.cdr.detectChanges();
      },
    });
  }

  openCreditModal(credito: Credit) {
    credito = { ...credito, venda: this.order };
    // Create a copy to avoid directly modifying the original and add the venda field
    this.modalReference = this.modalService.open(CreditModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });
    console.log('credito:', credito);
    const modalComponentInstance = this.modalReference.componentInstance as CreditModalComponent;
    modalComponentInstance.parcelaModel = { ...credito }; // Create a copy to avoid directly modifying the original
  }

  goBack(): void {
    this.location.back(); // Volta para a página anterior
  }
}
