import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ecommerce, ProductOrderEcommerce } from '../models';
import { ExpeditionService } from '../../expedition/services/expedition.service';
import { OrderService } from '../services/order.service';
import { BehaviorSubject, finalize } from 'rxjs';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { PaginationService } from 'src/app/core/services/pagination.service';

@Component({
  selector: 'app-e-commerce',
  templateUrl: './e-commerce.component.html',
  styleUrls: ['./e-commerce.component.scss'],
})
export class EcommerceComponent implements OnInit {
  ecommerces: Ecommerce[] = [];
  filteredEcommerces: Ecommerce[] = [];
  produtos: { [id: number]: ProductOrderEcommerce[] } = {};
  expanded: Set<number> = new Set();
  loadingProdutos: { [id: number]: boolean } = {};
  searchTerm: string = '';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  currentPage: number = 1;
  itemsPerPage: number = 50;
  totalPages: number = 0;
  displayedPages: number[] = [];
  startItem: number = 0;
  endItem: number = 0;
  selectedEcommerce: string = '';

  constructor(
    private route: ActivatedRoute,
    private expeditionService: ExpeditionService,
    private cdr: ChangeDetectorRef,
    private orderService: OrderService,
    private paginationService: PaginationService,
  ) {}

  showAlert(swalOptions: SweetAlertOptions) {
    this.swalOptions = swalOptions;
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }

  ngOnInit(): void {
    this.ecommerces = this.route.snapshot.data['ecommerces'] || [];
    // Ordenar por código
    this.ecommerces = this.ecommerces.sort((a, b) => a.codigo - b.codigo);
    this.filteredEcommerces = [...this.ecommerces];
    this.calculatePagination();
    this.updateDisplayedItems();
  }

  onSearch(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    let result = [...this.ecommerces];

    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter((order) => {
        const cliente = order.cliente_nome;
        return (cliente && cliente.toLowerCase().includes(term)) || order.codigo.toString().includes(term) || order.loja_id.toString().includes(term);
      });
    }

    if (this.selectedEcommerce) {
      result = result.filter((order) => String(order.loja_id) === this.selectedEcommerce);
    }

    // Ordenar por código
    result = result.sort((a, b) => a.codigo - b.codigo);

    this.filteredEcommerces = result;
    this.currentPage = 1;
    this.calculatePagination();
    this.updateDisplayedItems();
  }

  isExpanded(id: number): boolean {
    return this.expanded.has(id);
  }

  toggleExpand(id: number): void {
    if (!id) return;

    if (this.expanded.has(id)) {
      this.expanded.delete(id);
    } else {
      this.expanded.add(id);

      // Carrega produtos apenas uma vez
      if (!this.produtos[id]) {
        this.loadingProdutos[id] = true;

        this.expeditionService.getStockOutByEcommerceId(id).subscribe({
          next: (data) => {
            this.produtos[id] = data;
            this.loadingProdutos[id] = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error(`❌ Erro ao carregar produtos do pedido ${id}`, err);
            this.loadingProdutos[id] = false;
            this.cdr.detectChanges();
          },
        });
      }
    }
  }

  get totalBruto(): number {
    return this.filteredEcommerces.reduce((acc, order) => acc + Number(order.total_pedido || 0), 0);
  }

  trackByEcommerceId(index: number, item: Ecommerce): number {
    return item.ecommerce_id || index;
  }

  syncroSells(): void {
    this.isLoading$.next(true);
    this.orderService
      .syncroEcommerce()
      .pipe(
        finalize(() => {
          this.isLoading$.next(false);
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (data) => {
          this.showAlert({
            icon: 'success',
            title: 'Sincronização concluída com sucesso!',
            text: data.message,
            confirmButtonText: 'Ok',
          });
        },
        complete: () => {
          console.log('Sync complete');
        },
        error: (err) => {
          this.showAlert({
            icon: 'error',
            title: 'Erro!',
            text: err.error.message,
            confirmButtonText: 'Ok',
          });
          console.error(err);
        },
      });
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

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredEcommerces.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1; // Se totalPages for 0, define como 1
    }
    this.updateDisplayedPages();
  }

  updateDisplayedItems(): void {
    const { startItem, endItem } = this.paginationService.updateDisplayedItems(this.currentPage, this.itemsPerPage, this.filteredEcommerces.length);
    this.startItem = startItem;
    this.endItem = endItem;
  }

  get paginatedEcommerces(): Ecommerce[] {
    return this.paginationService.getPaginatedItems(this.filteredEcommerces, this.currentPage, this.itemsPerPage);
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
}
