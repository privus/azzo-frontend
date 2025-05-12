import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StockProjection } from '../models';
import { ExpeditionService } from '../services/expedition.service';

@Component({
  selector: 'app-stock-projection',
  templateUrl: './stock-projection.component.html',
  styleUrls: ['./stock-projection.component.scss'],
})
export class StockProjectionComponent implements OnInit {
  stockData: StockProjection[] = [];
  customDateRange: { start: string; end: string } = { start: '', end: '' };
  searchTerm: string = '';
  filteredData: StockProjection[] = [];
  selectedItemPedidos: number[] = [];
  showPedidosModal = false;

  statusOptions = [
    { id: '11138', label: 'Aguardando Aprovação' },
    { id: '11139', label: 'Pedido' },
    { id: '11468', label: 'Reprovado' },
    { id: '11491', label: 'Faturado' },
    { id: '11541', label: 'Pronto para Envio' },
    { id: '11542', label: 'Enviado' },
    { id: '11543', label: 'Entregue' },
  ];

  selectedStatus: string[] = [];
  dropdownOpen = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.stockData = this.route.snapshot.data['stockProjection'];
    this.applyFilter();
  }

  onSearch(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    let result = [...this.stockData];

    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter((product) => {
        return product.nome.toLowerCase().includes(term) || product.codigo.toLowerCase().includes(term);
      });
    }

    // Sort again after filtering
    this.filteredData = result.sort((a, b) => b.quantidade - a.quantidade);
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  isStatusSelected(id: string): boolean {
    return this.selectedStatus.includes(id);
  }

  onStatusToggle(id: string): void {
    if (this.isStatusSelected(id)) {
      this.selectedStatus = this.selectedStatus.filter((s) => s !== id);
    } else {
      this.selectedStatus.push(id);
    }
    this.onStatusChange();
  }

  getSelectedStatusLabels(): string {
    return this.statusOptions
      .filter((option) => this.selectedStatus.includes(option.id))
      .map((option) => option.label)
      .join(', ');
  }

  onStatusChange(): void {
    const statusVendaIds = this.selectedStatus.join(',');
    console.log('Selected statusVendaIds:', statusVendaIds);
    // TODO: Atualizar estoque baseado nos filtros aplicados
  }

  openPedidosModal(pedidos: number[]): void {
    this.selectedItemPedidos = pedidos;
    this.showPedidosModal = true;
  }

  closePedidosModal(): void {
    this.showPedidosModal = false;
  }

  getPedidosColumns(): number[][] {
    const chunkSize = 5;
    const chunks: number[][] = [];

    for (let i = 0; i < this.selectedItemPedidos.length; i += chunkSize) {
      chunks.push(this.selectedItemPedidos.slice(i, i + chunkSize));
    }
    return chunks;
  }

  editOrder(id: number): void {
    this.router.navigate(['commerce/orders', id]);
  }
}
