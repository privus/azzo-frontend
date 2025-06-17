import { Component, OnInit } from '@angular/core';
import { Produto } from '../../commerce/models';
import { ActivatedRoute } from '@angular/router';
import { PaginationService } from '../../../core/services/';
import { StockLiquid } from '../models';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit {
  products: Produto[] = [];
  stockLiquid: StockLiquid[] = [];

  filteredProducts: Produto[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 50;
  totalPages: number = 0;
  displayedPages: number[] = [];
  searchTerm: string = '';
  startItem: number = 0;
  endItem: number = 0;
  sortField: string = 'saldo_estoque';
  sortDirection: 'asc' | 'desc' = 'desc';
  selectedStatus: string = '';
  selectedSupplier: string = '';

  constructor(
    private route: ActivatedRoute,
    private paginationService: PaginationService,
  ) {}

  ngOnInit(): void {
    this.products = this.route.snapshot.data['product'];
    this.stockLiquid = this.route.snapshot.data['stockLiquid'];

    const produtosPorEan = new Map<number, Produto[]>();
    for (const prod of this.products) {
      if (!prod.ean) continue;
      const eanNum = +prod.ean;
      if (!produtosPorEan.has(eanNum)) produtosPorEan.set(eanNum, []);
      produtosPorEan.get(eanNum)!.push(prod);
    }

    this.products = this.products.map((prod) => {
      const eanNum = +prod.ean;
      const grupo = produtosPorEan.get(eanNum) || [];

      const unidade = grupo.find((p) => p.qt_uni === null);
      const caixa = grupo.find((p) => p.qt_uni !== null);

      // const match = this.stockLiquid.find((item) => item.codigo === prod.codigo);

      let estoque_em_caixas = '';

      // Cenário 1: Unidade + Caixa
      if (unidade && caixa && unidade.saldo_estoque && caixa.qt_uni) {
        const caixas = Math.floor(unidade.saldo_estoque / caixa.qt_uni);
        estoque_em_caixas = `${caixas} C/ ${caixa.qt_uni}`;
      }
      // Cenário 2: Apenas o próprio produto com qt_uni
      else if (prod.qt_uni && prod.saldo_estoque) {
        const caixas = Math.floor(prod.saldo_estoque / prod.qt_uni);
        estoque_em_caixas = `${caixas} C/ ${prod.qt_uni}`;
      }

      return {
        ...prod,
        estoque_em_caixas,
      };
    });

    this.applyFilter();
  }

  sortProducts(): void {
    const direction = this.sortDirection === 'asc' ? 1 : -1;
    this.filteredProducts.sort((a, b) => {
      const fieldA = (a as any)[this.sortField] ?? 0;
      const fieldB = (b as any)[this.sortField] ?? 0;
      return (fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0) * direction;
    });
  }

  changeSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'desc';
    }
    this.sortProducts();
    this.updateDisplayedItems();
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredProducts = this.products.filter((product) => {
      const visivel = !product.qt_uni || product.fornecedor?.fornecedor_id === 6;

      const matchBusca =
        term === '' ||
        product.nome.toLowerCase().includes(term) ||
        product.categoria.nome.toLowerCase().includes(term) ||
        product.codigo.toLowerCase().includes(term);

      const estoque = product.saldo_estoque;
      const estoqueMinimo = product.estoque_minimo;

      let matchStatus = true;

      switch (this.selectedStatus) {
        case 'disponivel':
          matchStatus = estoque >= estoqueMinimo;
          break;
        case 'baixo':
          matchStatus = estoque > 0 && estoque < estoqueMinimo;
          break;
        case 'sem':
          matchStatus = estoque <= 0;
          break;
      }

      const matchSupplier = !this.selectedSupplier || (product.fornecedor && product.fornecedor.fornecedor_id === +this.selectedSupplier);

      return visivel && matchBusca && matchStatus && matchSupplier;
    });

    this.sortProducts();
    this.currentPage = 1;
    this.calculatePagination();
    this.updateDisplayedItems();
  }

  onSearch(): void {
    this.applyFilter();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
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

  get paginatedProducts(): Produto[] {
    return this.paginationService.getPaginatedItems(this.filteredProducts, this.currentPage, this.itemsPerPage);
  }

  updateDisplayedItems(): void {
    const { startItem, endItem } = this.paginationService.updateDisplayedItems(this.currentPage, this.itemsPerPage, this.filteredProducts.length);
    this.startItem = startItem;
    this.endItem = endItem;
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
