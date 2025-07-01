import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { POrder } from '../models';
import { PaginationService, LocalStorageService } from '../../../core/services';
import { OrderService } from '../services/order.service'; // reutilizado

@Component({
  selector: 'app-order-listing-person',
  templateUrl: './order-listing-person.component.html',
  styleUrls: ['./order-listing-person.component.scss'],
})
export class OrderListingPersonComponent implements OnInit {
  orders: POrder[] = [];
  filteredOrders: POrder[] = [];
  currentPage = 1;
  itemsPerPage = 50;
  totalPages = 0;
  displayedPages: number[] = [];
  startItem = 0;
  endItem = 0;
  searchTerm = '';
  dataRange = '';
  customDateRange = { start: '', end: '' };
  selectedStatus = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  sortField = 'codigo';
  isLoading$ = new BehaviorSubject<boolean>(false);
  user = '';
  userCompanyId = 0;
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  showCustomDatePicker: boolean = false;
  selectedStatusPg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paginationService: PaginationService,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef,
    private localStorage: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.orders = this.route.snapshot.data['orders'] ?? [];
    this.filteredOrders = [...this.orders];

    const storageInfo = this.localStorage.get('STORAGE_MY_INFO');
    if (storageInfo) {
      const parsed = JSON.parse(storageInfo);
      this.user = parsed?.nome ?? '';
      this.userCompanyId = parsed?.empresa_id ?? 0;
    }

    this.sortBy('codigo');
    this.calculatePagination();
    this.updateDisplayedItems();
  }

  onSearch(): void {
    this.applyFilter();
  }

  onChangeItemsPerPage(): void {
    this.currentPage = 1;
    this.calculatePagination();
    this.updateDisplayedItems();
  }

  applyFilter(): void {
    let result = [...this.orders];

    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter((order) => {
        const clienteNome = order.cliente?.nome ?? '';
        return clienteNome.toLowerCase().includes(term) || order.numero_tiny?.toString().includes(term);
      });
    }

    if (this.selectedStatus) {
      result = result.filter((o) => o.status_venda.status_venda_id === +this.selectedStatus);
    }

    if (this.selectedStatusPg) {
      result = result.filter((o) => o.status_pagamento.status_pagamento_id === +this.selectedStatusPg);
    }

    this.filteredOrders = result;
    this.currentPage = 1;
    this.sortBy(this.sortField);
    this.calculatePagination();
    this.updateDisplayedItems();
  }

  onDateRange(): void {
    const selectedRange = this.dataRange;
    const now = new Date();

    let startDate = new Date(now);
    let endDate = new Date(now);

    if (selectedRange === 'custom') {
      this.showCustomDatePicker = true;

      const start = this.customDateRange.start;
      const end = this.customDateRange.end;

      if (!start) return; // Se não tem início, não faz nada
      const from = new Date(start);
      from.setDate(from.getDate() + 1);
      const fromDate = this.formatDate(from);

      if (end) {
        const to = new Date(end);
        to.setDate(to.getDate() + 2);
        const toDate = this.formatDate(to);

        this.orderService.getOrdersBetweenDatesP(fromDate, toDate).subscribe({
          next: (orders) => {
            this.orders = orders;
            this.applyFilter();
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Erro ao filtrar intervalo personalizado:', err),
        });
        return;
      } else {
        this.orderService.getOrdersBetweenDatesP(fromDate).subscribe({
          next: (orders) => {
            this.orders = orders;
            this.applyFilter();
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Erro ao filtrar data inicial personalizada:', err),
        });
      }
      return;
    }

    this.showCustomDatePicker = false;

    switch (selectedRange) {
      case 'today':
        break;

      case 'yesterday':
        startDate.setDate(now.getDate() - 1);
        const y = this.formatDate(startDate);

        this.orderService.getOrdersBetweenDatesP(y).subscribe({
          next: (orders) => {
            this.orders = orders;
            this.applyFilter();
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Erro ao filtrar intervalo personalizado:', err),
        });
        return;

      case 'last7':
        startDate.setDate(now.getDate() - 7);
        break;

      case 'last30':
        startDate.setDate(now.getDate() - 30);
        break;

      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const f = this.formatDate(startDate);
        endDate.setDate(endDate.getDate() + 1);
        const t = this.formatDate(endDate);

        this.orderService.getOrdersBetweenDatesP(f, t).subscribe({
          next: (orders) => {
            this.orders = orders;
            this.applyFilter();
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Erro ao filtrar mês atual:', err),
        });
        return;

      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of previous month

        const lastMonthFrom = this.formatDate(startDate);
        const lastMonthTo = this.formatDate(endDate);

        this.orderService.getOrdersBetweenDatesP(lastMonthFrom, lastMonthTo).subscribe({
          next: (orders) => {
            this.orders = orders;
            this.applyFilter();
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Erro ao filtrar mês passado:', err),
        });
        return;

      case 'lastWeek':
        const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday

        startDate.setDate(now.getDate() - dayOfWeek - 7); // Sunday last week
        startDate.setHours(0, 0, 0, 0);

        endDate.setDate(now.getDate() - dayOfWeek - 1); // Saturday last week
        endDate.setHours(23, 59, 59, 999);

        const lastWeekFrom = this.formatDate(startDate);
        const lastWeekTo = this.formatDate(endDate);

        this.orderService.getOrdersBetweenDatesP(lastWeekFrom, lastWeekTo).subscribe({
          next: (orders) => {
            this.orders = orders;
            this.applyFilter();
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Erro ao filtrar semana passada:', err),
        });
        return;

      default:
        startDate = new Date(0);
        break;
    }

    const fromDate = this.formatDate(startDate);

    this.orderService.getOrdersByDateP(fromDate).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.applyFilter();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao filtrar por data:', err),
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    const dir = this.sortDirection === 'asc' ? 1 : -1;

    this.filteredOrders.sort((a: any, b: any) => {
      let valA: any;
      let valB: any;

      switch (field) {
        case 'codigo':
          valA = a.numero_tiny ?? 0;
          valB = b.numero_tiny ?? 0;
          break;
        case 'dataVenda':
          valA = new Date(a.data_criacao).getTime();
          valB = new Date(b.data_criacao).getTime();
          break;
        case 'cliente':
          valA = a.cliente?.nome_empresa ?? '';
          valB = b.cliente?.nome_empresa ?? '';
          break;
        default:
          return 0;
      }
      return valA > valB ? dir : -dir;
    });
    this.calculatePagination();
    this.updateDisplayedItems();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
    this.updateDisplayedPages();
  }

  updateDisplayedPages(): void {
    const max = 3;
    let start = 1;
    let end = this.totalPages;

    if (this.totalPages > max) {
      const half = Math.floor(max / 2);
      start = Math.max(this.currentPage - half, 1);
      end = Math.min(start + max - 1, this.totalPages);
      if (end - start < max - 1) {
        start = Math.max(end - max + 1, 1);
      }
    }
    this.displayedPages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  getStatusClass(statusId: number): string {
    switch (statusId) {
      case 1: // Preparando envio
        return 'badge py-3 px-4 fs-7 badge-light-info';
      case 2: // Entregue
        return 'badge py-3 px-4 fs-7 badge-light-success';
      case 3: // Enviado
        return 'badge py-3 px-4 fs-7 badge-light-info';
      case 4: // Aprovado
        return 'badge py-3 px-4 fs-7 badge-light-primary';
      case 5: // Pronto para envio
        return 'badge py-3 px-4 fs-7 badge-light-info';
      default:
        return 'badge py-3 px-4 fs-7 badge-light-secondary';
    }
  }

  getStatusPagClass(statusId: number): string {
    switch (statusId) {
      case 1: // Pendente
        return 'badge py-2 px-3 fs-7 badge-light-warning opacity-75 text-muted';
      case 2: // Pago
        return 'badge py-2 px-3 fs-7 badge-light-primary opacity-75 text-muted';
      case 3: // Atrasado
        return 'badge py-3 px-4 fs-7 badge-light-danger text-dark';
      case 4: // Cancelado
        return 'badge py-2 px-3 fs-7 badge-light-info opacity-75 text-muted';
      default:
        return 'badge py-2 px-3 fs-7 badge-light-secondary opacity-50 text-muted';
    }
  }

  updateDisplayedItems(): void {
    const { startItem, endItem } = this.paginationService.updateDisplayedItems(this.currentPage, this.itemsPerPage, this.filteredOrders.length);
    this.startItem = startItem;
    this.endItem = endItem;
    this.cdr.detectChanges();
  }

  get paginatedOrders(): POrder[] {
    return this.paginationService.getPaginatedItems(this.filteredOrders, this.currentPage, this.itemsPerPage);
  }

  get totalBruto(): number {
    return this.filteredOrders.reduce((acc, order) => acc + +order.valor_final, 0);
  }

  get totalLucro(): number {
    let total = 0;

    for (const order of this.filteredOrders) {
      for (const item of order.itensVenda ?? []) {
        const lucro = item.lucro_bruto != null ? +item.lucro_bruto : +item.valor_total - (+item.produto?.preco || 0) * item.quantidade;

        total += lucro;
      }
    }

    return total;
  }

  showAlert(opts: SweetAlertOptions): void {
    this.swalOptions = opts;
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }

  editOrder(id: number): void {
    this.router.navigate(['commerce/orders-person', id]);
  }
}
