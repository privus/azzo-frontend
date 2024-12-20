import { Component, OnInit } from '@angular/core';
import { Produto } from '../models/product.model'; // Modelo de produto
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-products-listing',
  templateUrl: './products-listing.component.html',
  styleUrl: './products-listing.component.scss',
})
export class ProductsListingComponent implements OnInit {
  products: Produto[] = []; // Lista completa de produtos
  filteredProducts: Produto[] = []; // Produtos filtrados após a busca
  currentPage: number = 1;
  itemsPerPage: number = 50;
  totalPages: number = 0;
  displayedPages: number[] = []; // Páginas a serem exibidas na paginação
  searchTerm: string = '';
  startItem: number = 0;
  endItem: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Supondo que você esteja usando um resolver para carregar os produtos
    this.products = this.route.snapshot.data['product'] || [];
    this.applyFilter(); // Inicializa filteredProducts e a paginação
  }

  // Método para aplicar o filtro de busca
  applyFilter(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredProducts = [...this.products];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredProducts = this.products.filter(
        (product) => product.nome.toLowerCase().includes(term) || product.categoria.nome.toLowerCase().includes(term),
      );
    }
    this.currentPage = 1;
    this.calculatePagination();
    this.updateDisplayedItems();
  }

  // Método chamado quando o usuário digita na barra de busca
  onSearch(): void {
    this.applyFilter();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
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

  get paginatedProducts(): Produto[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
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

  // Atualiza as informações de exibição
  updateDisplayedItems(): void {
    this.startItem = this.filteredProducts.length === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
    this.endItem = Math.min(this.currentPage * this.itemsPerPage, this.filteredProducts.length);
  }

  // Método para editar um produto (implementação fictícia)
  editProduct(id: number) {
    if (id !== undefined && id !== null) {
      this.router.navigate(['commerce/products', id]);
    } else {
      console.error('ID do produto está indefinido ou nulo:', id);
    }
  }
}
