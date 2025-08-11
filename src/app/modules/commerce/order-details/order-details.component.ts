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
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
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
  code: number;
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  private modalReference: NgbModalRef;
  selectedFiles: File[] = [];
  uploadedFiles: File[] = [];
  @ViewChild('fileInput') fileInput!: any;
  private baseUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private location: Location,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    this.code = Number(this.route.snapshot.paramMap.get('id'));

    if (this.code) {
      this.orderService.getOrderById(this.code).subscribe({
        next: (order) => {
          this.orderId = order.venda_id;
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
      console.error('Invalid order ID:', this.code);
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
      numero_nfe: [{ value: '' }],
      valor_frete: [{ value: '' }],
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
      valor_frete: order.valor_frete || null,
    });

    if (order.numero_nfe) this.orderForm.controls['numero_nfe'].disable();
    if (order.valor_frete) this.orderForm.controls['valor_frete'].disable();
    if (order.status_venda.status_venda_id === 11468) this.orderForm.controls['status'].disable();
  }

  updateStatus(): void {
    const statusControl = this.orderForm.get('status');
    const status = statusControl ? statusControl.value : null;
    const nfe = this.orderForm.get('numero_nfe')?.value;
    const frete = this.orderForm.get('valor_frete')?.value || null;
    console.log('Updating status:', status);
    const update = { codigo: this.code, status_venda_id: Number(status), numero_nfe: Number(nfe), valor_frete: Number(frete) };
    console.log('Update object:', update);
    this.orderService.updateSellStatus(update).subscribe({
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
          text: err.error?.message,
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

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
      console.log('Arquivos selecionados:', this.selectedFiles);
      this.upload(); // Ou chame upload() aqui direto se quiser enviar imediatamente
    }
  }

  downloadFiles(orderId: number): void {
    this.http.get<any[]>(`${this.baseUrl}files/venda/${orderId}`).subscribe({
      next: (files) => {
        if (!files || files.length === 0) {
          console.warn('Nenhum arquivo encontrado.');
          return;
        }

        files.forEach((file) => {
          this.http
            .get(`${this.baseUrl}${file.path}`, {
              responseType: 'blob',
            })
            .subscribe((blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = file.filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            });
        });
      },
      error: (err) => {
        console.error('Erro ao buscar arquivos:', err);
      },
    });
  }

  upload() {
    this.orderService.uploadFiles(this.orderId, this.selectedFiles).subscribe({
      next: (resp) => {
        this.showAlert({
          icon: 'success',
          title: 'Arquivos enviados com sucesso!',
          text: resp.message,
          confirmButtonText: 'Ok',
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showAlert({
          icon: 'error',
          title: 'Erro!',
          text: 'Não foi possível enviar os arquivos.',
          confirmButtonText: 'Ok',
        });
        this.cdr.detectChanges();
        console.error(err);
      },
    });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  openNfeLink(url: string): void {
    window.open(url, '_blank');
  }

  isOlderThan7Days(date: string | Date): boolean {
    return new Date().getTime() - new Date(date).getTime() > 7 * 24 * 60 * 60 * 1000;
  }

  deleteNf(code: number) {
    Swal.fire({
      title: 'Confirmação',
      text: 'Deseja realmente excluir os dados da nota fiscal?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.deleteNfData(code).subscribe({
          next: (resp) => {
            Swal.fire({
              icon: 'success',
              title: `Dados da Nf-e limpos com sucesso!`,
              text: resp.message,
              confirmButtonText: 'Ok',
            });
            this.cdr.detectChanges();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Erro na exclusão dos dados da Nf-e!',
              text: err.error?.message || 'Não foi possível excluir a nota fiscal.',
              confirmButtonText: 'Ok',
            });
            console.error('Erro ao excluir nota fiscal:', err);
          },
        });
      }
    });
  }
}
