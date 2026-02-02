import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Romaneio, Transportadora } from '../models/romaneio.model';
import { PaginationService } from '../../../core/services/pagination.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ExpeditionService } from '../services/expedition.service';

@Component({
  selector: 'app-romaneio',
  templateUrl: './romaneio.component.html',
  styleUrls: ['./romaneio.component.scss'],
})
export class RomaneioComponent implements OnInit {
  romaneio: Romaneio[] = [];
  filteredRomaneio: Romaneio[] = [];
  startItem = 0;
  endItem = 0;
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 50;
  totalPages = 0;
  displayedPages: number[] = [];
  showRomaneioModal = false;
  transportadora: Transportadora[] = [];
  showTransInput = false;
  private baseUrl = environment.apiUrl;
  expanded: Set<number> = new Set();
  sortField: 'data_criacao' | 'romaneio_id' = 'data_criacao';
  sortDirection: 'asc' | 'desc' = 'desc';
  openFreteRomaneioId: number | null = null;
  shippingValue: number = 0;

  constructor(
    private route: ActivatedRoute,
    private paginationService: PaginationService,
    private http: HttpClient,
    private expeditionService: ExpeditionService,
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

  sortRomaneios(): void {
    this.filteredRomaneio.sort((a, b) => {
      let aValue = a[this.sortField];
      let bValue = b[this.sortField];

      if (this.sortField === 'data_criacao') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  toggleSort(field: 'data_criacao' | 'romaneio_id'): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  applyFilters(): void {
    const term = this.searchTerm.toLowerCase();
    let result = [...this.romaneio];

    if (term) {
      result = result.filter((romaneio) =>
        romaneio.vendas.some((v) => v.codigo.toString().includes(term) || (v.numero_nfe && v.numero_nfe.toString().includes(term))),
      );
    }

    this.filteredRomaneio = result;
    this.sortRomaneios();
    this.calculatePagination();
    this.updateDisplayedItems();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredRomaneio.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
    this.updateDisplayedPages();
  }

  updateDisplayedPages(): void {
    const maxDisplayed = 3;
    const half = Math.floor(maxDisplayed / 2);
    let start = Math.max(this.currentPage - half, 1);
    let end = Math.min(start + maxDisplayed - 1, this.totalPages);

    if (end - start < maxDisplayed - 1) {
      start = Math.max(end - maxDisplayed + 1, 1);
    }

    this.displayedPages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
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

  triggerFileUpload(romaneioId: number): void {
    const input = document.getElementById(`fileInput-${romaneioId}`) as HTMLInputElement | null;
    input?.click();
  }

  onFileSelected(event: Event, romaneioId: number): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ message: string }>(`${this.baseUrl}sells/import-fretes/${romaneioId}`, formData).subscribe({
      next: (resp) => {
        this.showAlert(resp?.message || 'Importação concluída com sucesso!');
      },
      error: () => {
        this.showAlert('Erro ao importar planilha de fretes.');
      },
    });
  }

  showAlert(text: string): void {
    Swal.fire({
      title: 'Importação',
      text,
      icon: 'success',
      confirmButtonText: 'OK',
    }).then(() => {
      window.location.reload();
    });
  }

  getTotalPedidos(r: Romaneio): number {
    return r.vendas.reduce((sum, v) => sum + (Number(v.valor_final) || 0), 0);
  }

  getFretePercentual(r: Romaneio): number {
    const totalPedidos = this.getTotalPedidos(r);
    return totalPedidos > 0 ? (r.valor_frete / totalPedidos) * 100 : 0;
  }

  applyShippingValue(romaneioId: number, shippingValue: number): void {
    this.expeditionService.shippingValue(romaneioId, shippingValue).subscribe({
      next: (resp) => {
        this.showAlert(resp?.message || 'Frete aplicado com sucesso!');
      },
      error: () => {
        this.showAlert('Erro ao aplicar frete.');
      },
    });
  }

  openFreteInput(romaneioId: number): void {
    this.openFreteRomaneioId = romaneioId;
    this.shippingValue = 0;
  }

  closeFreteInput(): void {
    this.openFreteRomaneioId = null;
    this.shippingValue = 0;
  }
}
