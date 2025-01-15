import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../models/costumer.model';
import { PaginationService } from '../../../core/services/pagination.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer-listing.component.html',
  styleUrls: ['./customer-listing.component.scss'],
})
export class CustomerListingComponent implements OnInit {
  costumers: Cliente[] = [];
  filteredCustomers: Cliente[] = [];
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
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.costumers = this.route.snapshot.data['customers'];
    console.log('CLIENTE ===> ', this.costumers);
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredCustomers = [...this.costumers];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredCustomers = this.costumers.filter(
        (costumer) => costumer.nome_empresa.toLowerCase().includes(term) || (costumer.numero_doc && costumer.numero_doc.includes(term)),
      );
    }
    this.currentPage = 1;
    this.calculatePagination();
    this.updateDisplayedItems();
  }

  onSearch(): void {
    this.applyFilter();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1; // Se totalPages for 0, define como 1
    }
    this.updateDisplayedPages();
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

  updateDisplayedItems(): void {
    const { startItem, endItem } = this.paginationService.updateDisplayedItems(this.currentPage, this.itemsPerPage, this.filteredCustomers.length);
    this.startItem = startItem;
    this.endItem = endItem;
  }

  editCustomer(codigo: number): void {
    this.router.navigate(['commerce/customers', codigo]);
  }

  get paginatedCustomer(): Cliente[] {
    return this.paginationService.getPaginatedItems(this.filteredCustomers, this.currentPage, this.itemsPerPage);
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
