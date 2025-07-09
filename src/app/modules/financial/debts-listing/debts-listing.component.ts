import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Categoria, Conta, Debt, Departamento } from '../models';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService, PaginationService } from '../../../core/services';
import { DebtService } from '../services/debt.service';
import Swal from 'sweetalert2';

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
  selectedAccount: string = '';
  departments: Departamento[];
  categories: Categoria[];
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  userCompanyId: number = 0;
  accounts: Conta[] = [];
  userEmail: string = '';
  cargo: string = '';

  constructor(
    private route: ActivatedRoute,
    private paginationService: PaginationService,
    private debtService: DebtService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private localStorage: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.debts = this.route.snapshot.data['debts'];
    const storageInfo = this.localStorage.get('STORAGE_MY_INFO');
    this.userCompanyId = storageInfo ? JSON.parse(storageInfo).companyId : '';
    this.userEmail = storageInfo ? JSON.parse(storageInfo).email : '';
    this.cargo = storageInfo ? JSON.parse(storageInfo).cargo.nome : '';
    this.sortField = 'debito_id';
    this.sortDirection = 'desc';
    this.loadDepartments();
    this.loadCategories();
    this.loadAccount();
    this.applyFilter();
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

  private loadAccount(): void {
    this.debtService.getAccount(this.userCompanyId).subscribe((accounts) => {
      this.accounts = accounts;
    });
    console.log('Contas carregadas:', this.accounts);
  }

  private loadCategories(): void {
    this.debtService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  applyFilter(): void {
    let result = [...this.debts];

    // 1. Filter by search term
    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter((debt) => (debt.descricao || '').toLowerCase().includes(term) || (debt.nome || '').toLowerCase().includes(term));
    }

    // 2. Filter by category
    if (this.selectedCategory) {
      result = result.filter((debt) => debt.categoria.categoria_id === +this.selectedCategory);
    }

    // 3. Filter by department
    if (this.selectedDepartment) {
      result = result.filter((debt) => debt.departamento.departamento_id === +this.selectedDepartment);
    }

    // 4. Filter by status
    if (this.selectedStatus) {
      result = result.filter((debt) => debt.status_pagamento.status_pagamento_id === +this.selectedStatus);
    }

    if (this.selectedAccount) {
      result = result.filter((debt) => debt.account.account_id === +this.selectedAccount);
    }

    // 5. Filter by date range (if custom dates are selected)
    if (this.customDateRange.start && this.customDateRange.end) {
      const startDate = new Date(this.customDateRange.start);
      const endDate = new Date(this.customDateRange.end);
      result = result.filter((debt) => {
        const competenciaDate = new Date(debt.data_competencia);
        return competenciaDate >= startDate && competenciaDate <= endDate;
      });
    }

    const getField = (d: Debt): any => {
      switch (this.sortField) {
        case 'debito_id':
          return d.debito_id;
        case 'nome':
          return d.nome;
        case 'valor_total':
          return +d.valor_total || 0;
        case 'conta':
          return d.account.account_id;
        case 'proxVencimento':
          const vencimento = this.nextDueDate(d);
          return vencimento.data ? new Date(vencimento.data) : new Date(9999, 11, 31);
        case 'datCompetencia':
          return d.data_competencia ? new Date(d.data_competencia) : new Date(9999, 11, 31);

        default:
          return '';
      }
    };

    result.sort((a, b) => {
      const valA = getField(a);
      const valB = getField(b);

      if (valA instanceof Date && valB instanceof Date) {
        return this.sortDirection === 'asc' ? valA.getTime() - valB.getTime() : valB.getTime() - valA.getTime();
      }

      if (typeof valA === 'string') {
        return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      return this.sortDirection === 'asc' ? valA - valB : valB - valA;
    });

    // 6. Update filtered debts and pagination
    this.filteredDebts = result;
    this.currentPage = 1;
    this.calculatePagination();
    this.updateDisplayedItems();
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilter();
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

  getStatusClass(statusId: number): string {
    switch (statusId) {
      case 1: // Pendente
        return 'badge py-3 px-4 fs-7 badge-light-warning';
      case 2: // Pago
        return 'badge py-3 px-4 fs-7 badge-light-primary';
      case 3: // Atrasado
        return 'badge py-3 px-4 fs-7 badge-light-danger';
      case 4: // Cancelado
        return 'badge py-3 px-4 fs-7 badge-light-info';
      default:
        return 'badge py-3 px-4 fs-7 badge-light-secondary';
    }
  }

  editDebt(id: number): void {
    this.router.navigate(['financial/debts', id]);
  }

  nextDueDate(debt: Debt): { data: string | null; valor: number | null } {
    if (!debt?.parcela_debito?.length) return { data: null, valor: null };

    const today = new Date();

    const next = debt.parcela_debito
      .filter((p) => p.status_pagamento?.status_pagamento_id === 1)
      .sort((a, b) => new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime())[0];

    if (next && new Date(next.data_vencimento) === today) {
      return {
        data: next.data_vencimento,
        valor: Number(next.valor),
      };
    }

    return {
      data: next?.data_vencimento ?? null,
      valor: next?.valor ? Number(next.valor) : null,
    };
  }

  get totalDebts(): number {
    return this.filteredDebts.reduce((acc, debt) => acc + +debt.valor_total, 0);
  }

  onDateRangeChange(): void {
    const selectedRange = this.dataRange;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let startDate = new Date(now);
    let endDate = new Date(now);

    if (selectedRange === 'custom') {
      this.showCustomDatePicker = true;

      const start = this.customDateRange.start;
      const end = this.customDateRange.end;

      if (!start) return; // Se não tem início, não faz nada
      const from = new Date(start);
      from.setDate(from.getDate() + 1);
      const fromDate = this.formatDate(from);

      if (end) {
        const to = new Date(end);
        to.setDate(to.getDate() + 2);
        const toDate = this.formatDate(to);

        this.debtService.getDebtsBetweenDates(this.userCompanyId, fromDate, toDate).subscribe({
          next: (debts) => {
            console.log('📦 DADOS RECEBIDOS DA API:', debts);
            this.debts = debts;
            this.applyFilter();
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Erro ao filtrar intervalo personalizado:', err),
        });
        return;
      } else {
        this.debtService.getDebtsBetweenDates(this.userCompanyId, fromDate).subscribe({
          next: (debts) => {
            this.debts = debts;
            this.applyFilter();
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Erro ao filtrar data inicial personalizada:', err),
        });
      }

      return;
    }

    this.showCustomDatePicker = false;

    switch (selectedRange) {
      case 'today':
        break;

      case 'yesterday':
        startDate.setDate(now.getDate() - 1);
        break;

      case 'last7':
        startDate.setDate(now.getDate() - 7);
        break;

      case 'last30':
        startDate.setDate(now.getDate() - 30);
        break;

      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const f = this.formatDate(startDate);
        endDate.setDate(endDate.getDate() + 1);
        const t = this.formatDate(endDate);

        this.debtService.getDebtsBetweenDates(this.userCompanyId, f, t).subscribe({
          next: (debts) => {
            this.debts = debts;
            this.applyFilter();
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Erro ao filtrar mês atual:', err),
        });
        return;

      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const from = this.formatDate(startDate);
        const to = this.formatDate(endDate);

        this.debtService.getDebtsBetweenDates(this.userCompanyId, from, to).subscribe({
          next: (debts) => {
            this.debts = debts;
            this.applyFilter();
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Erro ao filtrar mês passado:', err),
        });
        return;

      default:
        startDate = new Date(0);
        break;
    }
    const fromDate = this.formatDate(startDate);
    this.debtService.getDebtsFromDate(this.userCompanyId, fromDate).subscribe({
      next: (debts) => {
        this.debts = debts;
        this.applyFilter();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao filtrar por data:', err),
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  deleteDebt(id: number) {
    Swal.fire({
      title: 'Confirmação',
      text: `Deseja excluir o debito ${id}? Essa ação é irreversível!`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, Excluir!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Se o usuário confirmar, faz a exportação
        this.debtService.deleteDebt(id).subscribe({
          next: (resp) => {
            Swal.fire({
              icon: 'success',
              title: `Debito ${id} excluído com sucesso!`,
              text: resp.message,
              confirmButtonText: 'Ok',
            });
            this.applyFilter();
            window.location.reload();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: `Erro na exclusão do debito ${id}!`,
              text: 'Não foi possível excluir o debito. ' + err.error.message,
              confirmButtonText: 'Ok',
            });
            console.error('Erro ao exportar para Tiny:', err);
          },
        });
      }
    });
  }
}
