import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../commerce/services/order.service';
import { Order } from '../../commerce/models';

@Component({
  selector: 'app-assembly-shell',
  templateUrl: './assembly-shell.component.html',
})
export class AssemblyShellComponent implements OnInit {
  orders: Order[] = [];
  viewAll = false;

  // flag de loading ao adicionar
  isAdding = false;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router,
  ) {}

  ngOnInit() {
    // Recebe os pedidos do resolver
    this.route.data.subscribe((d) => (this.orders = d.orders));
  }

  /**
   * Remove o pedido no índice e redireciona se estivermos
   * no modo single (viewAll === false).
   */
  removeOrder(index: number) {
    this.orders.splice(index, 1);

    if (!this.viewAll) {
      if (this.orders.length === 0) {
        // Sem pedidos: retorna para a rota pai (ou ajusta conforme seu fluxo)
        this.router.navigate(['../'], { relativeTo: this.route });
      } else {
        // Se ainda há pedidos, navega para o próximo (ou último)
        const nextStep = Math.min(index + 1, this.orders.length);
        this.router.navigate([nextStep], { relativeTo: this.route });
      }
    }
  }

  /** Alterna entre ver tudo / ver um só */
  toggleViewAll() {
    this.viewAll = !this.viewAll;
    if (!this.viewAll && this.orders.length > 0) {
      // ao voltar para single view, mostra sempre o primeiro pedido
      this.router.navigate(['1'], { relativeTo: this.route });
    }
  }

  /** Abre prompt e adiciona um pedido novo pelo código */
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

        // Se estiver no modo single, já navega para o novo pedido
        if (!this.viewAll) {
          const newStep = this.orders.length; // 1-based
          this.router.navigate([newStep], { relativeTo: this.route });
        }
      },
      error: () => {
        alert(`Pedido ${codigo} não encontrado.`);
        this.isAdding = false;
      },
    });
  }
}
