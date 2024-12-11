import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '../models/costumer.model';

@Component({
  selector: 'app-costumer',
  standalone: true,
  imports: [],
  templateUrl: './costumer.component.html',
  styleUrl: './costumer.component.scss',
})
export class CostumerComponent implements OnInit {
  costumers: Cliente[] = [];
  filteredCostumers: Cliente[] = []; // Produtos filtrados após a busca
  currentPage: number = 1;
  itemsPerPage: number = 50;
  totalPages: number = 0;
  displayedPages: number[] = []; // Páginas a serem exibidas na paginação
  searchTerm: string = '';
  startItem: number = 0;
  endItem: number = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.costumers = this.route.snapshot.data['costumer'] || [];
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredCostumers = [...this.costumers];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredCostumers = this.costumers.filter(
        (costumer) =>
          costumer.nome.toLowerCase().includes(term) ||
          costumer.categoria.nome.toLowerCase().includes(term) ||
          costumer.nome_empresa.toLowerCase().includes(term),
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
    this.totalPages = Math.ceil(this.filteredCostumers.length / this.itemsPerPage);
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
    this.startItem = this.filteredCostumers.length === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
    this.endItem = Math.min(this.currentPage * this.itemsPerPage, this.filteredCostumers.length);
  }

  get paginatedCostumer(): Cliente[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCostumers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedPages();
      this.updateDisplayedItems();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedPages();
      this.updateDisplayedItems();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedPages();
      this.updateDisplayedItems();
    }
  }

  goToFirstPage(): void {
    if (this.currentPage !== 1) {
      this.currentPage = 1;
      this.updateDisplayedPages();
      this.updateDisplayedItems();
    }
  }

  goToLastPage(): void {
    if (this.currentPage !== this.totalPages) {
      this.currentPage = this.totalPages;
      this.updateDisplayedPages();
      this.updateDisplayedItems();
    }
  }

  onChangeItemsPerPage(): void {
    this.currentPage = 1;
    this.calculatePagination();
    this.updateDisplayedItems();
  }
}
