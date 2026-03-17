import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalesComparisonReport, Direcao, StatusAnalyticsByRegion, RegionDashboardData } from '../models';
import Chart from 'chart.js/auto';
import { OrderService } from '../../modules/commerce/services/order.service';
import { Cliente, ProductRankingItem } from '../../modules/commerce/models';
import { forkJoin } from 'rxjs';
import { ProductsService } from '../../core/services/products.service';
import { CustomerService } from '../../modules/commerce/services/customer.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  salesPerformance: SalesComparisonReport;
  private chartMarcasInstance: Chart | null = null;

  marcas: { nome: string; valor: number; cor: string }[] = [];
  departamentos: { nome: string; valor: number; cor: string }[] = [];
  departamentosP: { nome: string; valor: number; cor: string }[] = [];
  categorias: { nome: string; valor: number; cor: string }[] = [];
  categoriasP: { nome: string; valor: number; cor: string }[] = [];
  customDateRange: { start: string; end: string } = { start: '', end: '' };
  showCustomDatePicker = false;
  dataRange = 'thisMonth';
  periodoLabel = '';
  statusDates: string[] = [];
  selectedStatusDate: string = '';

  departamentosPerson: { nome: string; valor: number; cor: string }[] = [];
  categoriasPerson: { nome: string; valor: number; cor: string }[] = [];

  filtroDespesas: 'departamento' | 'categoria' = 'departamento';
  filtroDespesasPerson: 'departamento' | 'categoria' = 'departamento';

  private chartDebtsInstance: Chart | null = null;
  private chartDebtsPersonInstance: Chart | null = null;

  percentualPermance = 0;
  mesAtual: string = new Date().toLocaleString('default', { month: 'long' });

  // Gráficos por região
  regioesIds: number[] = [5, 7, 6, 4, 10, 2];
  regioesCharts: Map<number, Chart | null> = new Map();
  regioesData: Map<number, RegionDashboardData> = new Map();
  regioesDataList: { regiaoId: number; data: RegionDashboardData }[] = [];

  customers: Cliente[] = [];
  productRanking: ProductRankingItem[] = [];
  rankingLimit = 100;
  comparisonMode: 'lastYear' | 'lastMonth' = 'lastYear';
  statusDiff: Map<number, StatusAnalyticsByRegion> = new Map();

  readonly CORES = [
    '#1B5E20', // H2O
    '#50CD89', // Green
    '#009EF7', // Viceroy
    '#FFC700', // Purelli
    '#5E6278', // Black Fix
    '#FF69B4', // Vidal
  ];

  readonly MARCA_COLORS: Record<string, string> = {
    H2O: '#1B5E20',
    Green: '#50CD89',
    Viceroy: '#009EF7',
    Pureli: '#FFC700',
    'Black Fix': '#5E6278',
    Vidal: '#FF69B4',
  };

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private productsService: ProductsService,
    private cdr: ChangeDetectorRef,
    private customerService: CustomerService,
  ) {}

  ngOnInit(): void {
    this.salesPerformance = this.route.snapshot.data['salesAzzoPerformance'];
    this.customers = this.route.snapshot.data['customers'];
    this.productRanking = this.route.snapshot.data['productRanking'] || [];

    const statusAnalytics = this.route.snapshot.data['statusAnalytics'] || [];

    statusAnalytics.forEach((item: StatusAnalyticsByRegion) => {
      this.statusDiff.set(item.regiao_id, item);
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    this.periodoLabel = this.formatPeriodoLabel(this.formatDate(startOfMonth), this.formatDate(new Date()));

    this.mapDataToDashboard();
    this.processRegioesData();
    this.loadStatusDates();
  }

  ngAfterViewInit(): void {
    this.buildAllCharts();
    this.buildRegioesCharts();
  }

  ngOnDestroy(): void {
    this.destroyAllCharts();
  }

  private buildAllCharts(): void {
    this.buildChart();
    this.buildChartDebts();
    this.buildChartDebtsPerson();
    this.buildRegioesCharts();
  }

  private destroyAllCharts(): void {
    if (this.chartMarcasInstance) {
      this.chartMarcasInstance.destroy();
      this.chartMarcasInstance = null;
    }

    if (this.chartDebtsInstance) {
      this.chartDebtsInstance.destroy();
      this.chartDebtsInstance = null;
    }

    if (this.chartDebtsPersonInstance) {
      this.chartDebtsPersonInstance.destroy();
      this.chartDebtsPersonInstance = null;
    }

    this.regioesCharts.forEach((chart) => {
      if (chart) chart.destroy();
    });
    this.regioesCharts.clear();
  }

  private createDoughnutChart(
    canvasId: string,
    labels: string[],
    values: number[],
    colors: string[],
    existingChart: Chart | null,
    maintainAspectRatio = true,
  ): Chart | null {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!ctx) return existingChart;

    if (existingChart) {
      existingChart.destroy();
    }

    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio,
        cutout: '70%',
        plugins: {
          legend: { display: false },
        },
      },
    });
  }

  buildChart(): void {
    this.chartMarcasInstance = this.createDoughnutChart(
      'chart-marcas',
      this.marcas.map((m) => m.nome),
      this.marcas.map((m) => m.valor),
      this.marcas.map((m) => m.cor),
      this.chartMarcasInstance,
    );
  }

  buildChartDebts(): void {
    const dataSet = this.filtroDespesas === 'categoria' ? this.categorias : this.departamentos;

    this.chartDebtsInstance = this.createDoughnutChart(
      'chart-departamentos',
      dataSet.map((item) => item.nome),
      dataSet.map((item) => item.valor),
      dataSet.map((item) => item.cor),
      this.chartDebtsInstance,
    );
  }

  buildChartDebtsPerson(): void {
    const dataSet = this.filtroDespesasPerson === 'categoria' ? this.categoriasPerson : this.departamentosPerson;

    this.chartDebtsPersonInstance = this.createDoughnutChart(
      'chart-departamentos-personizi',
      dataSet.map((item) => item.nome),
      dataSet.map((item) => item.valor),
      dataSet.map((item) => item.cor),
      this.chartDebtsPersonInstance,
    );
  }

  getBadgeClass(direcao: Direcao): string {
    switch (direcao) {
      case 'aumento':
        return 'badge-light-success';
      case 'queda':
        return 'badge-light-danger';
      default:
        return 'badge-light-secondary';
    }
  }

  getBadgeIcon(direcao: Direcao): string {
    switch (direcao) {
      case 'aumento':
        return 'ki-arrow-up text-success';
      case 'queda':
        return 'ki-arrow-down text-danger';
      default:
        return 'ki-minus text-muted';
    }
  }

  getDirecaoFromNumber(value: number): Direcao {
    if (value > 0) return 'aumento';
    if (value < 0) return 'queda';
    return 'neutro';
  }

  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }

  colorStyle(index: number): string {
    const cor = this.CORES[index % this.CORES.length];
    return `background-color: ${cor}`;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  onDateRange(): void {
    const selectedRange = this.dataRange;

    let startDate = new Date();
    let endDate = new Date();

    if (selectedRange === 'custom') {
      this.showCustomDatePicker = true;

      const start = this.customDateRange.start;
      const end = this.customDateRange.end;

      if (!start) return;

      const from = new Date(start);
      const fromDate = this.formatDate(from);

      if (end) {
        const to = new Date(end);
        const toDate = this.formatDate(to);
        this.updateDash(fromDate, toDate);
      } else {
        this.updateDash(fromDate, fromDate);
      }

      return;
    }

    this.showCustomDatePicker = false;

    switch (selectedRange) {
      case 'yesterday':
        startDate.setDate(startDate.getDate() - 1);
        endDate = new Date(startDate);
        break;

      case 'last7':
        startDate.setDate(startDate.getDate() - 7);
        break;

      case 'last15':
        startDate.setDate(startDate.getDate() - 15);
        break;

      case 'last30':
        startDate.setDate(startDate.getDate() - 30);
        break;

      case 'thisMonth':
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        endDate = new Date(startDate.getFullYear(), startDate.getMonth(), new Date().getDate());
        break;

      case 'lastMonth':
        startDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1);
        endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        break;

      case 'lastWeek': {
        const dayOfWeek = startDate.getDay();
        startDate.setDate(startDate.getDate() - dayOfWeek - 7);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        break;
      }

      default:
        endDate = new Date(startDate);
        break;
    }

    const fromDate = this.formatDate(startDate);

    endDate.setDate(endDate.getDate() + 1);
    const toDate = this.formatDate(endDate);

    this.updateDash(fromDate, toDate);
  }

  private parseDate(dateStr: string): Date {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  private getComparisonPeriod(from: Date, to: Date) {
    const from1 = new Date(from);
    const to1 = new Date(to);

    if (this.comparisonMode === 'lastMonth') {
      from1.setMonth(from1.getMonth() - 1);
      to1.setMonth(to1.getMonth() - 1);
    } else {
      from1.setFullYear(from1.getFullYear() - 1);
      to1.setFullYear(to1.getFullYear() - 1);
    }

    return { from1, to1 };
  }

  private updateDash(fromDate2: string, toDate2: string): void {
    const from2 = this.parseDate(fromDate2);
    const to2 = this.parseDate(toDate2);

    const { from1, to1 } = this.getComparisonPeriod(from2, to2);

    const fromDate1 = this.formatDate(from1);
    const toDate1 = this.formatDate(to1);

    console.log('[updateDash]', { fromDate1, toDate1, fromDate2, toDate2 });

    this.periodoLabel = this.formatPeriodoLabel(fromDate2, toDate2);

    forkJoin([
      this.orderService.getPerformanceSales(fromDate1, toDate1, fromDate2, toDate2),
      this.productsService.getProductRanking(fromDate2, toDate2),
    ]).subscribe({
      next: ([salesPerformance, productRanking]) => {
        this.salesPerformance = salesPerformance;
        this.productRanking = productRanking || [];

        this.mapDataToDashboard();

        this.cdr.detectChanges();
        this.buildAllCharts();
      },
      error: (err) => console.error('Erro ao atualizar dashboard:', err),
    });
  }

  private mapDataToDashboard(): void {
    const faturamento = this.salesPerformance?.faturamentoPorMarcaMesAtual || {};
    const ordemMarcas = ['H2O', 'Green', 'Viceroy', 'Pureli', 'Black Fix', 'Vidal'];

    this.marcas = ordemMarcas
      .filter((nome) => faturamento[nome] !== undefined)
      .map((nome) => ({
        nome,
        valor: faturamento[nome],
        cor: this.MARCA_COLORS[nome] || this.CORES[0],
      }))
      .sort((a, b) => a.valor - b.valor);
  }

  private formatPeriodoLabel(from: string, to: string): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' };

    const [fromYear, fromMonth, fromDay] = from.split('-').map(Number);
    const [toYear, toMonth, toDay] = to.split('-').map(Number);

    const fromDate = new Date(fromYear, fromMonth - 1, fromDay);
    const toDate = new Date(toYear, toMonth - 1, toDay);

    if (from === to) {
      return fromDate.toLocaleDateString('pt-BR', options);
    }

    return `${fromDate.toLocaleDateString('pt-BR', options)} a ${toDate.toLocaleDateString('pt-BR', options)}`;
  }

  private processRegioesData(): void {
    this.regioesData.clear();

    const ordemStatus = [101, 104, 102, 103];
    const customersByRegion = new Map<number, Cliente[]>();

    this.customers.forEach((customer) => {
      const regiaoId = customer.regiao?.regiao_id;
      if (!regiaoId) return;

      if (!customersByRegion.has(regiaoId)) {
        customersByRegion.set(regiaoId, []);
      }

      customersByRegion.get(regiaoId)!.push(customer);
    });

    this.regioesIds.forEach((regiaoId) => {
      const clientesRegiao = customersByRegion.get(regiaoId) || [];
      const nomeRegiao = clientesRegiao[0]?.regiao?.nome || `Região ${regiaoId}`;

      const statusMap = new Map<number, { nome: string; quantidade: number; statusId: number }>();

      clientesRegiao.forEach((cliente) => {
        if (cliente.status_cliente) {
          const statusId = cliente.status_cliente.status_cliente_id;
          const statusNome = cliente.status_cliente.nome;

          if (statusMap.has(statusId)) {
            statusMap.get(statusId)!.quantidade++;
          } else {
            statusMap.set(statusId, {
              nome: statusNome,
              quantidade: 1,
              statusId,
            });
          }
        }
      });

      const statusArray = Array.from(statusMap.values())
        .map((status) => {
          const diff = this.statusDiff.get(regiaoId);

          let diffValue = 0;

          if (diff) {
            switch (status.statusId) {
              case 101:
                diffValue = diff.ativo;
                break;
              case 104:
                diffValue = diff.atencao;
                break;
              case 102:
                diffValue = diff.frio;
                break;
              case 103:
                diffValue = diff.inativo;
                break;
              default:
                diffValue = 0;
                break;
            }
          }

          return {
            nome: status.nome,
            quantidade: status.quantidade,
            cor: this.getStatusColorById(status.statusId),
            statusId: status.statusId,
            diff: diffValue,
          };
        })
        .sort((a, b) => ordemStatus.indexOf(a.statusId) - ordemStatus.indexOf(b.statusId));

      this.regioesData.set(regiaoId, {
        nome: nomeRegiao,
        status: statusArray,
      });
    });

    this.regioesDataList = this.regioesIds
      .map((regiaoId) => ({
        regiaoId,
        data: this.regioesData.get(regiaoId),
      }))
      .filter(
        (
          item,
        ): item is {
          regiaoId: number;
          data: RegionDashboardData;
        } => !!item.data,
      );
  }

  private getStatusColorById(statusId: number): string {
    switch (statusId) {
      case 101:
        return '#50CD89'; // Ativo
      case 104:
        return '#FFC700'; // Atenção
      case 103:
        return '#F1416C'; // Inativo
      case 102:
        return '#009EF7'; // Frio
      default:
        return this.CORES[statusId % this.CORES.length];
    }
  }

  private buildRegioesCharts(): void {
    this.regioesIds.forEach((regiaoId) => {
      const regiaoData = this.regioesData.get(regiaoId);
      if (!regiaoData || regiaoData.status.length === 0) return;

      const chartId = `chart-regiao-${regiaoId}`;

      const existingChart = this.regioesCharts.get(regiaoId) || null;

      const chart = this.createDoughnutChart(
        chartId,
        regiaoData.status.map((s) => s.nome),
        regiaoData.status.map((s) => s.quantidade),
        regiaoData.status.map((s) => s.cor),
        existingChart,
        false,
      );

      this.regioesCharts.set(regiaoId, chart);
    });
  }

  getRegiaoData(regiaoId: number): RegionDashboardData | undefined {
    return this.regioesData.get(regiaoId);
  }

  getRankingBadgeClass(direcao: Direcao): string {
    switch (direcao) {
      case 'aumento':
        return 'badge-light-success';
      case 'queda':
        return 'badge-light-danger';
      default:
        return 'badge-light-secondary';
    }
  }

  getRankingBadgeIcon(direcao: Direcao): string {
    switch (direcao) {
      case 'aumento':
        return 'ki-duotone ki-arrow-up fs-5 text-success ms-n1';
      case 'queda':
        return 'ki-duotone ki-arrow-down fs-5 text-danger ms-n1';
      default:
        return 'ki-duotone ki-minus fs-5 text-muted ms-n1';
    }
  }

  getDisplayedRanking(): ProductRankingItem[] {
    return this.productRanking.slice(0, this.rankingLimit);
  }

  trackByRegiao(_: number, item: { regiaoId: number; data: RegionDashboardData }): number {
    return item.regiaoId;
  }

  trackByStatus(_: number, item: { statusId: number }): number {
    return item.statusId;
  }

  trackByMarca(_: number, item: { nome: string }): string {
    return item.nome;
  }

  trackByProduto(_: number, item: ProductRankingItem): string | number {
    return item.codigo || item.nome;
  }

  private loadStatusDates(): void {
    this.customerService.getStatusDates().subscribe((dates) => {
      const sorted = dates.sort((a, b) => b.localeCompare(a));

      if (sorted.length >= 2) {
        this.selectedStatusDate = sorted[1];
      }

      this.statusDates = sorted;
    });
  }

  updateStatusAnalytics(): void {
    if (!this.selectedStatusDate) return;

    const date = this.selectedStatusDate;

    const observables = this.regioesIds.map((regiaoId) => this.customerService.getStatusHistory(regiaoId, date));

    forkJoin(observables).subscribe({
      next: (result) => {
        this.statusDiff.clear();

        result.forEach((item: StatusAnalyticsByRegion) => {
          this.statusDiff.set(item.regiao_id, item);
        });

        this.processRegioesData();

        this.cdr.detectChanges();
        this.buildRegioesCharts();
      },
      error: (err) => console.error('Erro ao atualizar status:', err),
    });
  }
}
