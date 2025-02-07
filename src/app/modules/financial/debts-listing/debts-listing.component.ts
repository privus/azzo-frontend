import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Categoria, Debt, Departamento } from '../modal/debt.modal';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationService } from '../../../core/services';
import { DebtService } from '../services/debt.service';

@Component({
  selector: 'app-debts-listing',
  templateUrl: './debts-listing.component.html',
  styleUrls: ['./debts-listing.component.scss'],
})
export class DebtsListingComponent implements OnInit {
  debts: Debt[] = [];
  filteredDebts: Debt[] = [];
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
  selectedDepartment: string = '';
  selectedCategory: string = '';
  departments: Departamento[];
  categories: Categoria[];

  constructor(
    private route: ActivatedRoute,
    private paginationService: PaginationService,
    private debtService: DebtService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.debts = this.route.snapshot.data['debts'];
    this.applyFilter();
    this.loadDepartments();
    this.loadCategories();
    this.cdr.detectChanges();

    console.log('Loaded debts:', this.debts);
  }

  onSearch(): void {
    this.applyFilter();
  }

  private loadDepartments(): void {
    this.debtService.getAllDepartaments().subscribe((department) => {
      this.departments = department;
    });
  }

  private loadCategories(): void {
    this.debtService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  applyFilter(): void {
    console.log('Applying filter with searchTerm:', this.searchTerm);

    let result = [...this.debts];

    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter((debts) => {
        const descricao = debts.descricao;
        return descricao.includes(term);
      });
    }

    if (this.customDateRange.start && this.customDateRange.end) {
      const startDate = new Date(this.customDateRange.start);
      const endDate = new Date(this.customDateRange.end);
      result = result.filter((debts) => {
        const creationDate = new Date(debts.data_criacao);
        return creationDate >= startDate && creationDate <= endDate;
      });
    }

    // Update filtereddebtss and recalculate pagination
    this.filteredDebts = result;
    console.log('Filtered debtss:', this.filteredDebts);

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

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredDebts.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1; // Se totalPages for 0, define como 1
    }
    this.updateDisplayedPages();
  }

  updateDisplayedItems(): void {
    const { startItem, endItem } = this.paginationService.updateDisplayedItems(this.currentPage, this.itemsPerPage, this.filteredDebts.length);
    this.startItem = startItem;
    this.endItem = endItem;
  }

  get paginatedDebts(): Debt[] {
    return this.paginationService.getPaginatedItems(this.filteredDebts, this.currentPage, this.itemsPerPage);
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

  getNextDueDate(debt: Debt): string {
    if (!debt.parcela_debito || debt.parcela_debito.length === 0) {
      return 'Sem parcelas';
    }

    const nextParcel = debt.parcela_debito.find((parcela) => !parcela.data_pagamento);

    if (nextParcel) {
      const date = new Date(nextParcel.data_vencimento);
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    }

    return 'Todas pagas';
  }

  editOrder(id: number): void {
    this.router.navigate(['financial/debts', id]);
  }
}
