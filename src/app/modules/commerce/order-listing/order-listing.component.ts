/* eslint-disable prettier/prettier */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Pedido } from '../models/order.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationService } from '../../../core/services/pagination.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order-listing',
  templateUrl: './order-listing.component.html',
  styleUrls: ['./order-listing.component.scss'],
})
export class OrderListingComponent implements OnInit {
  orders: Pedido[] = [];
  filteredOrders: Pedido[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 50;
  totalPages: number = 0;
  displayedPages: number[] = [];
  searchTerm: string = '';
  dataRange: string = '';
  startItem: number = 0;
  endItem: number = 0;
  showCustomDatePicker: boolean = false;
  customDateRange: { start: string; end: string } = { start: '', end: '' };
  selectedStatus: string = '';


  constructor( 
    private route: ActivatedRoute, 
    private paginationService: PaginationService, 
    private router: Router,
    private readonly orderService: OrderService,
    private cdr: ChangeDetectorRef,    
  ) {}

  ngOnInit(): void {
    this.orders = this.route.snapshot.data['orders'];
    console.log('PEDIDOS ===> ', this.orders);
    this.applyFilter();
  }

  onSearch(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    // 1) Partir do array principal que está na memória.
    //    (Esse array já pode ter sido atualizado pelo filtro de data ou pela API).
    let result = [...this.orders];
  
    // 2) Filtrar por texto (searchTerm) se houver
    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter((order) => {
        const cliente = order.cliente;
        return (
          (cliente && cliente.nome_empresa.toLowerCase().includes(term)) ||
          (cliente && cliente.numero_doc && cliente.numero_doc.includes(term)) ||
          order.codigo.toString().includes(term)
        );
      });
    }
  
    // 3) Filtrar por status (se selectedStatus não for vazio)
    if (this.selectedStatus) {
      result = result.filter(
        (order) => order.status_venda.status_venda_id === +this.selectedStatus
      );
    }
  
    // 4) Atualiza filteredOrders e a paginação
    this.filteredOrders = result;
    this.currentPage = 1;
    this.calculatePagination();
    this.updateDisplayedItems();
  }
  

  updateDisplayedPages(): void {
    const maxDisplayedPages = 3;
    let startPage: number;
    let endPage: number;

    if (this.totalPages <= maxDisplayedPages) {
      startPage = 1;
      endPage = this.totalPages;
    } else {
      if (this.currentPage <= Math.ceil(maxDisplayedPages / 2)) {
        startPage = 1;
        endPage = maxDisplayedPages;
      } else if (this.currentPage + Math.floor(maxDisplayedPages / 2) >= this.totalPages) {
        startPage = this.totalPages - maxDisplayedPages + 1;
        endPage = this.totalPages;
      } else {
        startPage = this.currentPage - 1;
        endPage = this.currentPage + 1;
      }
    }
    this.displayedPages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  editOrder(id: number): void {
    this.router.navigate(['commerce/orders', id]);
  }

  getStatusClass(statusId: number): string {
    switch (statusId) {
      case 11138: // Aguardando Aprovação
        return 'badge py-3 px-4 fs-7 badge-light-warning';
      case 11139: // Pedido
        return 'badge py-3 px-4 fs-7 badge-light-primary';
      case 11468: // Reprovado
        return 'badge py-3 px-4 fs-7 badge-light-danger';
      case 11491: // Faturado
        return 'badge py-3 px-4 fs-7 badge-light-info';
      case 11541: // Pronto para Envio
        return 'badge py-3 px-4 fs-7 badge-light-info';
      case 11542: // Enviado
        return 'badge py-3 px-4 fs-7 badge-light-info';
      case 11543: // Entregue
        return 'badge py-3 px-4 fs-7 badge-light-success';
      default:
        return 'badge py-3 px-4 fs-7 badge-light-secondary';
    }
  }
  

  onDateChange(event: any): void {
    const selectedDate = new Date(event.target.value);
    this.filteredOrders = this.orders.filter((item) => {
      const itemDate = new Date(item.data_criacao);
      return itemDate.toDateString() === selectedDate.toDateString();
    });
  }
    
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1; // Se totalPages for 0, define como 1
    }
    this.updateDisplayedPages();
  }

  updateDisplayedItems(): void {
    const { startItem, endItem } = this.paginationService.updateDisplayedItems(this.currentPage, this.itemsPerPage, this.filteredOrders.length);
    this.startItem = startItem;
    this.endItem = endItem;
  }

  get paginatedOrders(): Pedido[] {
    return this.paginationService.getPaginatedItems(this.filteredOrders, this.currentPage, this.itemsPerPage);
  }

  previousPage(): void {
    this.currentPage = this.paginationService.navigateToPage(this.currentPage, this.totalPages, 'previous');
    this.updateDisplayedPages();
    this.updateDisplayedItems();
  }

  nextPage(): void {
    this.currentPage = this.paginationService.navigateToPage(this.currentPage, this.totalPages, 'next');
    this.updateDisplayedPages();
    this.updateDisplayedItems();
  }

  goToPage(page: number): void {
    this.currentPage = this.paginationService.navigateToPage(this.currentPage, this.totalPages, page);
    this.updateDisplayedPages();
    this.updateDisplayedItems();
  }

  goToFirstPage(): void {
    this.currentPage = this.paginationService.navigateToPage(this.currentPage, this.totalPages, 'first');
    this.updateDisplayedPages();
    this.updateDisplayedItems();
  }

  goToLastPage(): void {
    this.currentPage = this.paginationService.navigateToPage(this.currentPage, this.totalPages, 'last');
    this.updateDisplayedPages();
    this.updateDisplayedItems();
  }

  onChangeItemsPerPage(): void {
    this.currentPage = 1;
    this.calculatePagination();
    this.updateDisplayedItems();
  }

  applyCustomDateRange(): void {
    const { start } = this.customDateRange;
    const fromDate = this.formatDate(new Date(start));
  
    this.orderService.getOrdersByDate(fromDate).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.applyFilter();
      },
      error: (err) => console.error('Erro ao filtrar por data (custom):', err),
    });
  
    this.showCustomDatePicker = false;
  }

    onDateRangeChange(): void {
      const selectedRange = this.dataRange;
      const now = new Date();
      // Zeramos horas para pegar "início do dia" se necessário
      now.setHours(0, 0, 0, 0);

      let startDate = new Date(now);

      switch (selectedRange) {
        case 'today':
          // startDate fica como hoje às 00:00
          break;

        case 'yesterday':
          // Ontem às 00:00
          startDate.setDate(now.getDate() - 1);
          break;

        case 'last7':
          // Últimos 7 dias
          startDate.setDate(now.getDate() - 7);
          break;

        case 'last30':
          startDate.setDate(now.getDate() - 30);
          break;

        case 'thisMonth':
          // Primeiro dia do mês atual
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;

        case 'lastMonth':
          // Primeiro dia do mês anterior
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          break;

        case 'custom':
          this.showCustomDatePicker = true;
          return; // Mostra os inputs de data e sai
        default:
          // Se não escolheu nada, pega tudo desde 1970
          startDate = new Date(0);
          break;
      }

      // Converte a data para string no formato YYYY-MM-DD
      const fromDate = this.formatDate(startDate);
      console.log('Filtrando por data:', fromDate);

      // Faz a requisição ao backend
      this.orderService.getOrdersByDate(fromDate).subscribe({
        next: (orders) => {
          // Sobrescreve o array principal
          this.orders = orders;
          console.log('Pedidos filtrados:', orders);
          this.applyFilter();
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erro ao filtrar por data:', err),
      });
    }

    // Utilitário para formatar data em yyyy-MM-dd
    private formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    get totalBruto(): number {
      return this.filteredOrders.reduce((acc, order) => {
        const valor = parseFloat(order.valor_pedido || '0');
        return acc + valor;
      }, 0);
    }

    get totalLucro(): number {
      let total = 0;
    
      for (const order of this.filteredOrders) {
        if (order.itensVenda && order.itensVenda.length > 0) {
          for (const item of order.itensVenda) {
            const custoUnit = +item.produto?.preco_custo
            const qtd = item.quantidade
            const valorTotal = +item.valor_total
            
            // Lucro de cada item
            const lucroItem = valorTotal - (custoUnit * qtd);
            total += lucroItem;
          }
        }
      }
    
      return total;
    }
}
