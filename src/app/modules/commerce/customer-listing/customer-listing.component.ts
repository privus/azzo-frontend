import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente, Regiao, StatusCliente } from '../models';
import { PaginationService } from '../../../core/services/';

@Component({
  selector: 'app-customer',
  templateUrl: './customer-listing.component.html',
  styleUrls: ['./customer-listing.component.scss'],
})
export class CustomerListingComponent implements OnInit {
  customers: Cliente[] = [];
  filteredCustomers: Cliente[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 50;
  totalPages: number = 0;
  displayedPages: number[] = [];
  searchTerm: string = '';
  startItem: number = 0;
  endItem: number = 0;
  selectedRegion: string = '';
  selectedStatus: string = '';
  statusClientes: StatusCliente[] = [];
  regioes: Regiao[] = [];

  constructor(
    private route: ActivatedRoute,
    private paginationService: PaginationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.customers = this.route.snapshot.data['customers'];
    this.statusClientes = this.route.snapshot.data['statusClientes'];
    console.log('CLIENTE ===> ', this.customers);
    this.applyFilter();
  }

  applyFilter(): void {
    let result = [...this.customers];

    // 1) Filtrar pelo termo de pesquisa (Nome ou Documento)
    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter(
        (customer) =>
          customer.nome_empresa?.toLowerCase().includes(term) ||
          customer.nome?.toLowerCase().includes(term) ||
          (customer.numero_doc && customer.numero_doc.includes(term)),
      );
    }

    // 2) Filtrar por Região (se selecionado)
    if (this.selectedRegion) {
      result = result.filter((customer) => customer.regiao?.codigo === +this.selectedRegion);
    }

    // 3) Filtrar por Status (se selecionado)
    if (this.selectedStatus) {
      result = result.filter((customer) => customer.status_cliente?.status_cliente_id === +this.selectedStatus);
    }

    // 4) Atualizar a lista de clientes filtrados
    this.filteredCustomers = result;
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
