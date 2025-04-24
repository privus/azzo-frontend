import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../services/order.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Order } from '../models/order.model';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CreditModalComponent } from '../../financial/credit-modal/credit-modal.component';
import { Credit } from '../../financial/models';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

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
      nome_fantasia: [{ value: '', disabled: true }],
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
      cidade: [{ value: '', disabled: true }],
      chave_nfe: [{ value: '', disabled: true }],
      data_emissao_nfe: [{ value: '', disabled: true }],
      numero_nfe: [{ value: '', disabled: true }],
      obs: [{ value: '', disabled: true }],
    });
  }

  private patchFormWithOrder(order: Order): void {
    this.orderForm.patchValue({
      codigo: order.codigo,
      data_criacao: order.data_criacao,
      nome_empresa: order.cliente.nome_empresa,
      nome_fantasia: order.cliente.nome,
      email: order.cliente.email,
      telefone: order.cliente.celular || order.cliente.telefone_comercial,
      status: order.status_venda.status_venda_id,
      valor_final: order.valor_final,
      vendedor: order.vendedor.nome,
      cnpj: order.cliente.numero_doc,
      metodo: order.metodo_pagamento,
      cidade: order.cliente.cidade_string,
      chave_nfe: order.chave_acesso,
      data_emissao_nfe: order.data_emissao_nfe,
      numero_nfe: order.numero_nfe,
      obs: order.observacao,
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
      error: (err) => {
        this.showAlert({
          icon: 'error',
          title: 'Erro!',
          text: 'Não foi possível atualizar o pedido.',
          confirmButtonText: 'Ok',
        });
        this.cdr.detectChanges();
        console.error(err);
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

  exportTiny(id: number, uf: string, exportado: number): void {
    let message = `Deseja exportar para o Tiny ${uf}?`;

    // Se já foi exportado, exibe um aviso antes
    if (exportado === 1) {
      message = `Este pedido já foi exportado para o Tiny ${uf}. Deseja exportá-lo novamente?`;
    }

    Swal.fire({
      title: 'Confirmação',
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, Exportar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Se o usuário confirmar, faz a exportação
        this.orderService.exportTiny(id).subscribe({
          next: (resp) => {
            Swal.fire({
              icon: 'success',
              title: `Exportação concluída com sucesso! Tiny ${uf}`,
              text: resp.message,
              confirmButtonText: 'Ok',
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: `Erro na exportação! Tiny ${uf}`,
              text: 'Não foi possível exportar o pedido. ' + err.error.message,
              confirmButtonText: 'Ok',
            });
            console.error('Erro ao exportar para Tiny:', err);
          },
        });
      }
    });
  }
}
