import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../commerce/services/order.service';
import { Order } from '../../commerce/models';
import { AssemblyResponse } from '../models';

@Component({
  selector: 'app-assembly-shell',
  templateUrl: './assembly-shell.component.html',
  styleUrls: ['./assembly-shell.component.scss'],
})
export class AssemblyShellComponent implements OnInit {
  orders: Order[] = [];
  viewAll = false;

  isAdding = false;
  isFullscreen = false;
  progress: AssemblyResponse[] = [];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      console.log('DATA do resolver:', data);
      this.orders = data.orders.orders;
      this.progress = data.orders.progress;
      console.log('PEDIDOS', this.orders, 'PROGRESS', this.progress);
    });
  }

  getProgressForOrder(codigo: number): AssemblyResponse {
    return (
      this.progress.find((p) => p.codigo === codigo) || {
        codigo,
        progress: [],
        status: 'iniciada',
        montagemId: null,
      }
    );
  }

  removeOrder(index: number) {
    this.orders.splice(index, 1);

    if (!this.viewAll) {
      if (this.orders.length === 0) {
        this.router.navigate(['../'], { relativeTo: this.route });
      } else {
        const nextStep = Math.min(index + 1, this.orders.length);
        this.router.navigate([nextStep], { relativeTo: this.route });
      }
    }
  }

  toggleViewAll() {
    this.viewAll = !this.viewAll;
    if (!this.viewAll && this.orders.length > 0) {
      this.router.navigate(['1'], { relativeTo: this.route });
    }
  }

  addOrder() {
    const input = prompt('Digite o código do pedido para adicionar:');
    if (!input) return;

    const codigo = Number(input);
    if (isNaN(codigo)) {
      alert('Código inválido.');
      return;
    }

    this.isAdding = true;
    this.orderService.getOrderById(codigo).subscribe({
      next: (order) => {
        this.orders.push(order);
        this.isAdding = false;

        if (!this.viewAll) {
          const newStep = this.orders.length;
          this.router.navigate([newStep], { relativeTo: this.route });
        }
      },
      error: () => {
        alert(`Pedido ${codigo} não encontrado.`);
        this.isAdding = false;
      },
    });
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }
}
