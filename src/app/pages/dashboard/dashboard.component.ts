import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalesComparisonReport, Direcao, DebtsComparisonReport } from '../models';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  salesPerformance: SalesComparisonReport;
  debtsAzzoPerformance: DebtsComparisonReport;
  debtsPersonPerformance: DebtsComparisonReport;

  marcas: { nome: string; valor: number; cor: string }[] = [];
  departamentos: { nome: string; valor: number; cor: string }[] = [];
  categorias: { nome: string; valor: number; cor: string }[] = [];

  departamentosPerson: { nome: string; valor: number; cor: string }[] = [];
  categoriasPerson: { nome: string; valor: number; cor: string }[] = [];

  filtroDespesas: 'departamento' | 'categoria' = 'departamento';
  filtroDespesasPerson: 'departamento' | 'categoria' = 'departamento';

  private chartDebtsInstance: Chart | null = null;
  private chartDebtsPersonInstance: Chart | null = null;

  percentualPermance: number = 0;
  mesAtual: string = new Date().toLocaleString('default', { month: 'long' });

  readonly CORES = [
    '#1B5E20', // H2O
    '#50CD89', // Green
    '#009EF7', // Viceroy
    '#FFC700', // Purelli
    '#5E6278', // Black Fix
    '#FF69B4', // Vidal
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.salesPerformance = this.route.snapshot.data['salesAzzoPerformance'];
    this.debtsAzzoPerformance = this.route.snapshot.data['debtsAzzoPerformance'];
    this.debtsPersonPerformance = this.route.snapshot.data['debtsPersonPerformance'];

    // Marcas Azzo
    const faturamento = this.salesPerformance.faturamentoPorMarcaMesAtual;
    const ordemMarcas = ['H2O', 'Green', 'Viceroy', 'Pureli', 'Black Fix', 'Vidal'];
    this.marcas = ordemMarcas
      .filter((nome) => faturamento[nome] !== undefined)
      .map((nome, index) => ({
        nome,
        valor: faturamento[nome],
        cor: this.CORES[index],
      }))
      .sort((a, b) => a.valor - b.valor);

    // Despesas Azzo
    const fatDeps = this.debtsAzzoPerformance.despesasDepartamento;
    this.departamentos = Object.keys(fatDeps)
      .map((nome, index) => ({
        nome,
        valor: fatDeps[nome],
        cor: this.CORES[index % this.CORES.length],
      }))
      .sort((a, b) => a.valor - b.valor);

    const fatCats = this.debtsAzzoPerformance.despesasCategoria;
    this.categorias = Object.keys(fatCats)
      .map((nome) => ({
        nome,
        valor: fatCats[nome],
        cor: this.getRandomColor(),
      }))
      .sort((a, b) => a.valor - b.valor);

    // Despesas Personizi
    const fatDepsPerson = this.debtsPersonPerformance.despesasDepartamento;
    this.departamentosPerson = Object.keys(fatDepsPerson)
      .map((nome, index) => ({
        nome,
        valor: fatDepsPerson[nome],
        cor: this.CORES[index % this.CORES.length],
      }))
      .sort((a, b) => a.valor - b.valor);

    const fatCatsPerson = this.debtsPersonPerformance.despesasCategoria;
    this.categoriasPerson = Object.keys(fatCatsPerson)
      .map((nome) => ({
        nome,
        valor: fatCatsPerson[nome],
        cor: this.getRandomColor(),
      }))
      .sort((a, b) => a.valor - b.valor);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.buildChart();
      this.buildChartDebts();
      this.buildChartDebtsPerson();
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

    new Chart(ctx, {
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
}
