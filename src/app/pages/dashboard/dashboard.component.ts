import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalesComparisonReport, Direcao } from '../models';
import Chart from 'chart.js/auto';
import { DebtService } from 'src/app/modules/financial/services/debt.service';
import { OrderService } from 'src/app/modules/commerce/services/order.service';
import { CustomerService } from 'src/app/modules/commerce/services/customer.service';
import { Cliente } from 'src/app/modules/commerce/models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  salesPerformance: SalesComparisonReport;
  private chartMarcasInstance: Chart | null = null;

  marcas: { nome: string; valor: number; cor: string }[] = [];
  departamentos: { nome: string; valor: number; cor: string }[] = [];
  departamentosP: { nome: string; valor: number; cor: string }[] = [];
  categorias: { nome: string; valor: number; cor: string }[] = [];
  categoriasP: { nome: string; valor: number; cor: string }[] = [];
  private chartPagamentosCruzados: Chart | null = null;
  private chartPagamentosGrupo: Chart | null = null;
  customDateRange: { start: string; end: string } = { start: '', end: '' };
  showCustomDatePicker: boolean = false;
  dataRange: string = 'thisMonth';
  periodoLabel: string = '';

  departamentosPerson: { nome: string; valor: number; cor: string }[] = [];
  categoriasPerson: { nome: string; valor: number; cor: string }[] = [];

  filtroDespesas: 'departamento' | 'categoria' = 'departamento';
  filtroDespesasPerson: 'departamento' | 'categoria' = 'departamento';

  private chartDebtsInstance: Chart | null = null;
  private chartDebtsPersonInstance: Chart | null = null;

  percentualPermance: number = 0;
  mesAtual: string = new Date().toLocaleString('default', { month: 'long' });

  // Gráficos por região
  regioesIds: number[] = [5, 7, 6, 4, 10, 2];
  regioesCharts: Map<number, Chart | null> = new Map();
  regioesData: Map<number, { nome: string; status: { nome: string; quantidade: number; cor: string; statusId: number }[] }> = new Map();
  customers: Cliente[] = [];

  readonly CORES = [
    '#1B5E20', // H2O
    '#50CD89', // Green
    '#009EF7', // Viceroy
    '#FFC700', // Purelli
    '#5E6278', // Black Fix
    '#FF69B4', // Vidal
  ];

  constructor(
    private route: ActivatedRoute,
    private debtsService: DebtService,
    private orderService: OrderService,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.salesPerformance = this.route.snapshot.data['salesAzzoPerformance'];
    this.customers = this.route.snapshot.data['customers'];

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    this.periodoLabel = this.formatPeriodoLabel(this.formatDate(startOfMonth), this.formatDate(new Date()));

    this.mapDataToDashboard();
    this.processRegioesData(); // ✅ processa antes de buildar os gráficos
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.buildChart();
      this.buildRegioesCharts(); // já usa dados prontos
    }, 0);
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  buildChart(): void {
    const ctx = document.getElementById('chart-marcas') as HTMLCanvasElement;
    if (!ctx) return;

    // ⚠️ Destroi o gráfico anterior, se existir!
    if (this.chartMarcasInstance) {
      this.chartMarcasInstance.destroy();
    }

    this.chartMarcasInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.marcas.map((m) => m.nome),
        datasets: [
          {
            data: this.marcas.map((m) => m.valor),
            backgroundColor: this.marcas.map((m) => m.cor),
          },
        ],
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: { legend: { display: false } },
      },
    });
  }

  buildChartDebts(): void {
    const ctx = document.getElementById('chart-departamentos') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chartDebtsInstance) this.chartDebtsInstance.destroy();

    const dataSet = this.filtroDespesas === 'categoria' ? this.categorias : this.departamentos;

    this.chartDebtsInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: dataSet.map((item) => item.nome),
        datasets: [
          {
            data: dataSet.map((item) => item.valor),
            backgroundColor: dataSet.map((item) => item.cor),
          },
        ],
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: { legend: { display: false } },
      },
    });
  }

  buildChartDebtsPerson(): void {
    const ctx = document.getElementById('chart-departamentos-personizi') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chartDebtsPersonInstance) this.chartDebtsPersonInstance.destroy();

    const dataSet = this.filtroDespesasPerson === 'categoria' ? this.categoriasPerson : this.departamentosPerson;

    this.chartDebtsPersonInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: dataSet.map((item) => item.nome),
        datasets: [
          {
            data: dataSet.map((item) => item.valor),
            backgroundColor: dataSet.map((item) => item.cor),
          },
        ],
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: { legend: { display: false } },
      },
    });
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
        return '';
    }
  }

  colorStyle(index: number): string {
    const cor = this.CORES[index % this.CORES.length];
    return `background-color: ${cor}`;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
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
        endDate = new Date(); // hoje
        break;

      case 'lastMonth':
        startDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1);
        endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        break;

      case 'lastWeek':
        const dayOfWeek = startDate.getDay();
        // Começo da semana anterior
        startDate.setDate(startDate.getDate() - dayOfWeek - 7);
        // Final da semana anterior
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        break;

      default:
        // Período só de hoje
        endDate = new Date(startDate);
        break;
    }

    const fromDate = this.formatDate(startDate);
    const toDate = this.formatDate(endDate);

    // Sempre passa os dois!
    this.updateDash(fromDate, toDate);
  }

  private updateDash(fromDate2: string, toDate2: string) {
    // Calcule o período anterior:
    const from2 = new Date(fromDate2);
    const to2 = new Date(toDate2);

    // Use new Date para não alterar o objeto original!
    const from1 = new Date(from2.getFullYear(), from2.getMonth() - 1, from2.getDate());
    const to1 = new Date(to2.getFullYear(), to2.getMonth() - 1, to2.getDate());

    const fromDate1 = this.formatDate(from1);
    const toDate1 = this.formatDate(to1);
    console.log('[updateDash] Datas:', { fromDate1, toDate1, fromDate2, toDate2 });
    console.log('Filtro:', { fromDate2, toDate2 });
    this.periodoLabel = this.formatPeriodoLabel(fromDate2, toDate2);
    console.log('Label calculado:', this.periodoLabel);

    // Agora passe os quatro parâmetros para cada método
    const salesPerformance$ = this.orderService.getPerformanceSales(fromDate1, toDate1, fromDate2, toDate2);
    const debtsAzzoPerformance$ = this.debtsService.getPerformanceDebts(2, fromDate1, toDate1, fromDate2, toDate2);
    const debtsPersonPerformance$ = this.debtsService.getPerformanceDebts(4, fromDate1, toDate1, fromDate2, toDate2);
    const debtsComparisonReport$ = this.debtsService.getComparisonDebts(fromDate2, toDate2);

    forkJoin([salesPerformance$, debtsAzzoPerformance$, debtsPersonPerformance$, debtsComparisonReport$]).subscribe({
      next: ([salesPerformance]) => {
        this.salesPerformance = salesPerformance;

        this.mapDataToDashboard();

        // Redesenhe seus gráficos aqui
        setTimeout(() => {
          this.buildChart();
          this.buildChartDebts();
          this.buildChartDebtsPerson();
        }, 0);
      },
      error: (err) => console.error('Erro ao atualizar dashboard:', err),
    });
  }

  private mapDataToDashboard() {
    // Marcas Azzo
    const faturamento = this.salesPerformance.faturamentoPorMarcaMesAtual || {};
    const ordemMarcas = ['H2O', 'Green', 'Viceroy', 'Pureli', 'Black Fix', 'Vidal'];
    this.marcas = ordemMarcas
      .filter((nome) => faturamento[nome] !== undefined)
      .map((nome, index) => ({
        nome,
        valor: faturamento[nome],
        cor: this.CORES[index],
      }))
      .sort((a, b) => a.valor - b.valor);
  }

  private formatPeriodoLabel(from: string, to: string): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' };

    // PARSE STRING 'YYYY-MM-DD' COM new Date(ano, mes-1, dia)
    const [fromYear, fromMonth, fromDay] = from.split('-').map(Number);
    const [toYear, toMonth, toDay] = to.split('-').map(Number);

    const fromDate = new Date(fromYear, fromMonth - 1, fromDay);
    const toDate = new Date(toYear, toMonth - 1, toDay);

    if (from === to) {
      return fromDate.toLocaleDateString('pt-BR', options);
    } else {
      return `${fromDate.toLocaleDateString('pt-BR', options)} a ${toDate.toLocaleDateString('pt-BR', options)}`;
    }
  }

  private processRegioesData(): void {
    this.regioesData.clear(); // evita duplicações

    const ordemStatus = [101, 104, 102, 103]; // ATIVO → ATENÇÃO → FRIO → INATIVO

    this.regioesIds.forEach((regiaoId) => {
      const clientesRegiao = this.customers.filter((c) => c.regiao?.regiao_id === regiaoId);
      const nomeRegiao = clientesRegiao[0]?.regiao?.nome || `Região ${regiaoId}`;

      // Agrupar por status
      const statusMap = new Map<number, { nome: string; quantidade: number; statusId: number }>();

      clientesRegiao.forEach((cliente) => {
        if (cliente.status_cliente) {
          const statusId = cliente.status_cliente.status_cliente_id;
          const statusNome = cliente.status_cliente.nome;

          if (statusMap.has(statusId)) {
            statusMap.get(statusId)!.quantidade++;
          } else {
            statusMap.set(statusId, { nome: statusNome, quantidade: 1, statusId });
          }
        }
      });

      // Converter para array, aplicar cores e ordenar pela sequência fixa
      const statusArray = Array.from(statusMap.values())
        .map((status) => ({
          nome: status.nome,
          quantidade: status.quantidade,
          cor: this.getStatusColorById(status.statusId),
          statusId: status.statusId,
        }))
        .sort((a, b) => ordemStatus.indexOf(a.statusId) - ordemStatus.indexOf(b.statusId)); // ✅ ordem forçada

      this.regioesData.set(regiaoId, {
        nome: nomeRegiao,
        status: statusArray,
      });
    });
  }

  private getStatusColorById(statusId: number): string {
    // Cores baseadas nos status conhecidos (101, 102, 103)
    switch (statusId) {
      case 101:
        return '#50CD89'; // Verde - Ativo
      case 104:
        return '#FFC700'; // Amarelo - Atenção
      case 103:
        return '#F1416C'; // Vermelho - Inativo
      case 102:
        return '#009EF7'; // Azul - Frio
      default:
        // Cores padrão para outros status
        return this.CORES[statusId % this.CORES.length];
    }
  }

  private buildRegioesCharts(): void {
    this.regioesIds.forEach((regiaoId) => {
      const chartId = `chart-regiao-${regiaoId}`;
      const ctx = document.getElementById(chartId) as HTMLCanvasElement;
      if (!ctx) return;

      const existingChart = this.regioesCharts.get(regiaoId);
      if (existingChart) existingChart.destroy();

      const regiaoData = this.regioesData.get(regiaoId);
      if (!regiaoData || regiaoData.status.length === 0) return;

      const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: regiaoData.status.map((s) => s.nome),
          datasets: [
            {
              data: regiaoData.status.map((s) => s.quantidade),
              backgroundColor: regiaoData.status.map((s) => s.cor),
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // permite controlar o tamanho pelo CSS
          cutout: '70%',
          plugins: {
            legend: { display: false },
            title: {
              display: false,
            },
          },
        },
      });

      this.regioesCharts.set(regiaoId, chart);
    });
  }

  getRegiaoData(regiaoId: number): { nome: string; status: { nome: string; quantidade: number; cor: string; statusId: number }[] } | undefined {
    return this.regioesData.get(regiaoId);
  }
}
