import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../services/order.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pedido } from '../models/order.model';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  orderForm: FormGroup;
  order: Pedido;
  orderId: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    this.orderId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.orderId) {
      this.orderService.getOrderById(this.orderId).subscribe({
        next: (order) => {
          this.order = order;
          console.log('PEDIDO ===> ', this.order);
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
    });
  }

  private patchFormWithOrder(order: Pedido): void {
    this.orderForm.patchValue({
      codigo: order.codigo,
      data_criacao: order.data_criacao,
      nome_empresa: order.cliente.nome_empresa,
      email: order.cliente.email,
      telefone: order.cliente.celular || order.cliente.telefone_comercial,
      status: order.status_venda.status_venda_id,
      valor_final: order.valor_final,
      vendedor: order.vendedor.nome,
      cnpj: order.cliente.numero_doc,
    });
  }
}
