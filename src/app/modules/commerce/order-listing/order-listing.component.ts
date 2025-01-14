/* eslint-disable prettier/prettier */
import { Component, OnInit } from '@angular/core';
import { Pedido } from '../models/order.model';
import { ActivatedRoute } from '@angular/router';
import { PaginationService } from '../../../core/services/pagination.service';

@Component({
  selector: 'app-order-listing',
  templateUrl: './order-listing.component.html',
  styleUrl: './order-listing.component.scss',
})
export class OrderListingComponent implements OnInit {
  orders: Pedido[] = [];
  filteredOrders: Pedido[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 50;
  totalPages: number = 0;
  displayedPages: number[] = [];
  searchTerm: string = '';
  startItem: number = 0;
  endItem: number = 0;

  constructor(
    private route: ActivatedRoute,
    private paginationService: PaginationService,
  ) {}

  ngOnInit(): void {
    this.orders = this.route.snapshot.data['orders'];
    console.log('PEDIDO ===> ', this.orders);
    this.applyFilter();
  }

  onSearch(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredOrders = [...this.orders];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredOrders = this.orders.filter((order) => {
        const cliente = order.cliente;

        return (
          (cliente && cliente.nome_empresa.toLowerCase().includes(term)) || // Verifica se o cliente existe antes de acessar `nome_empresa`
          (cliente && cliente.numero_doc && cliente.numero_doc.includes(term)) || // Verifica se o cliente existe antes de acessar `numero_doc`
          order.codigo.toString().includes(term)
        );
      });
    }
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

  getStatusClass(id: number): string {
    const knownIds = [11138, 11139, 11468, 11491, 11541, 11542, 11543];
    return knownIds.includes(id) ? `badge-${id}` : 'badge-default';
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
}
