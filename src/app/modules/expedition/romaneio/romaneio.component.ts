import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Romaneio, Transportadora } from '../models/romaneio.model';
import { PaginationService } from '../../../core/services/pagination.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-romaneio',
  templateUrl: './romaneio.component.html',
  styleUrls: ['./romaneio.component.scss'],
})
export class RomaneioComponent implements OnInit {
  romaneio: Romaneio[] = [];
  filteredRomaneio: Romaneio[] = [];
  paginatedRomaneios: Romaneio[] = [];
  startItem: number = 0;
  endItem: number = 0;
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 50;
  totalPages = 0;
  displayedPages: number[] = [];
  showRomaneioModal = false;
  transportadora: Transportadora[] = [];
  showTransInput = false;
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  expanded: Set<number> = new Set();

  constructor(
    private route: ActivatedRoute,
    private paginationService: PaginationService,
  ) {}

  ngOnInit() {
    this.romaneio = this.route.snapshot.data['romaneio'];
    this.applyFilters();
  }

  toggleExpand(id: number): void {
    if (this.expanded.has(id)) {
      this.expanded.delete(id);
    } else {
      this.expanded.add(id);
    }
  }

  isExpanded(id: number): boolean {
    return this.expanded.has(id);
  }

  onSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.romaneio];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter((romaneio) => romaneio.vendas.some((v) => v.codigo.toString().includes(term)));
    }

    this.filteredRomaneio = result;

    this.calculatePagination();
    this.updateDisplayedItems();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredRomaneio.length / this.itemsPerPage);
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
    const { startItem, endItem } = this.paginationService.updateDisplayedItems(this.currentPage, this.itemsPerPage, this.filteredRomaneio.length);
    this.startItem = startItem;
    this.endItem = endItem;
  }

  get paginatedOrders(): Romaneio[] {
    return this.paginationService.getPaginatedItems(this.filteredRomaneio, this.currentPage, this.itemsPerPage);
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

  toggleTransportadoraInput(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.showTransInput = value === '';
  }
}
