import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Produto } from '../../commerce/models';
import { ActivatedRoute } from '@angular/router';
import { PaginationService } from '../../../core/services/';
import { StockById, StockDuration, StockOverview } from '../models';
import { ExpeditionService } from '../services/expedition.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit {
  products: Produto[] = [];
  filteredProducts: Produto[] = [];
  loadingSaidas: { [produtoId: number]: boolean } = {};
  stockDuration: StockDuration[] = [];
  stockOverview: StockOverview;
  valorVenda: number = 0;
  valorCusto: number = 0;
  percentualFaturamento: number = 0;

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
  expanded: Set<number> = new Set();

  constructor(
    private route: ActivatedRoute,
    private paginationService: PaginationService,
    private expeditionService: ExpeditionService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.products = this.route.snapshot.data['product'];
    this.stockOverview = this.route.snapshot.data['stockOverview'];
    this.stockDuration = this.stockOverview.stockDuration;
    this.valorVenda = this.stockOverview.stockValue.valor_venda;
    this.valorCusto = this.stockOverview.stockValue.valor_custo;
    this.percentualFaturamento = this.stockOverview.stockValue.percentual_faturamento;
    const produtosPorEan = new Map<number, Produto[]>();
    for (const prod of this.products) {
      if (!prod.ean) continue;
      const eanNum = +prod.ean;
      if (!produtosPorEan.has(eanNum)) produtosPorEan.set(eanNum, []);
      produtosPorEan.get(eanNum)!.push(prod);
    }

    // Map: produto_id => StockDuration
    const durationMap = new Map(this.stockDuration.map((item) => [+item.produto_id, item]));

    // Adiciona diasRestantes e mediaDiaria ao objeto Produto
    this.products = this.products.map((prod) => {
      const match = durationMap.get(prod.produto_id);
      const diasRestantes = match?.diasRestantes ?? null;
      const mediaDiaria = match?.mediaDiaria ?? null;
      const status = this.statusPorDias(diasRestantes, prod.estoque_minimo);

      const eanNum = +prod.ean;
      const grupo = produtosPorEan.get(eanNum) || [];

      const unidade = grupo.find((p) => p.qt_uni === null);
      const caixa = grupo.find((p) => p.qt_uni !== null);

      let estoque_em_caixas = '';

      if (unidade && caixa && unidade.saldo_estoque && caixa.qt_uni) {
        const caixas = Math.floor(unidade.saldo_estoque / caixa.qt_uni);
        estoque_em_caixas = `${caixas} C/ ${caixa.qt_uni}`;
      } else if (prod.qt_uni && prod.saldo_estoque) {
        const caixas = Math.floor(prod.saldo_estoque / prod.qt_uni);
        estoque_em_caixas = `${caixas} C/ ${prod.qt_uni}`;
      }

      return {
        ...prod,
        estoque_em_caixas,
        diasRestantes,
        mediaDiaria,
        statusPorDias: status,
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
        product.ean.toLowerCase().includes(term) ||
        product.codigo.toLowerCase().includes(term);

      let matchStatus = true;

      switch (this.selectedStatus) {
        case 'disponivel':
          matchStatus = product.statusPorDias === 'disponivel';
          break;
        case 'baixo':
          matchStatus = product.statusPorDias === 'baixo';
          break;
        case 'sem':
          matchStatus = product.statusPorDias === 'sem';
          break;
        case 'excesso':
          matchStatus = product.statusPorDias === 'excesso';
          break;
        default:
          matchStatus = true;
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

  isExpanded(id: number): boolean {
    return this.expanded.has(id);
  }

  toggleExpand(id: number): void {
    if (this.expanded.has(id)) {
      this.expanded.delete(id);
    } else {
      this.expanded.add(id);
      this.loadingSaidas[id] = true; // <-- seta loading

      const produto = this.filteredProducts.find((p) => p.produto_id === id);
      this.expeditionService.getStockOutById(id).subscribe((saidas: StockById[]) => {
        if (!produto) return;
        produto.saidas = saidas;
        this.loadingSaidas[id] = false; // <-- desativa loading
        this.cdr.detectChanges();
      });
    }
  }

  splitSaidas(saidas: any[]): [any[], any[], any[]] {
    const total = saidas?.length || 0;
    const size = Math.ceil(total / 3);
    return [saidas?.slice(0, size) || [], saidas?.slice(size, 2 * size) || [], saidas?.slice(2 * size) || []];
  }

  private statusPorDias(diasRestantes: number | null, estoqueMinimoDias: number): 'disponivel' | 'baixo' | 'sem' | 'excesso' {
    if (diasRestantes == null) return 'sem'; // fallback

    if (diasRestantes <= 0) return 'sem';
    if (diasRestantes < estoqueMinimoDias) return 'baixo';
    if (diasRestantes >= estoqueMinimoDias * 2) return 'excesso';
    return 'disponivel';
  }
}
