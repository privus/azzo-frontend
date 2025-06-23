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
  debtsPerformance: DebtsComparisonReport;
  marcas: { nome: string; valor: number; cor: string }[] = [];
  departamentos: { nome: string; valor: number; cor: string }[] = [];
  categorias: { nome: string; valor: number; cor: string }[] = [];
  filtroDespesas: 'departamento' | 'categoria' = 'departamento';
  private chartDebtsInstance: Chart | null = null;

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
    this.salesPerformance = this.route.snapshot.data['salesPerformance'];
    this.debtsPerformance = this.route.snapshot.data['debtsPerformance'];
    console.log('Sales ==================', this.salesPerformance);
    const faturamento = this.salesPerformance.faturamentoPorMarcaMesAtual;
    const ordemMarcas = ['H2O', 'Green', 'Viceroy', 'Purelli', 'Black Fix', 'Vidal'];
    this.marcas = ordemMarcas
      .filter((nome) => faturamento[nome] !== undefined)
      .map((nome, index) => ({
        nome,
        valor: faturamento[nome],
        cor: this.CORES[index],
      }))
      .sort((a, b) => a.valor - b.valor);

    const fatDeps = this.debtsPerformance.despesasDepartamento;
    this.departamentos = Object.keys(fatDeps)
      .map((nome, index) => ({
        nome,
        valor: fatDeps[nome],
        cor: this.CORES[index % this.CORES.length],
      }))
      .sort((a, b) => a.valor - b.valor);

    const fatCats = this.debtsPerformance.despesasCategoria;
    this.categorias = Object.keys(fatCats)
      .map((nome) => ({
        nome,
        valor: fatCats[nome],
        cor: this.getRandomColor(),
      }))
      .sort((a, b) => a.valor - b.valor);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.buildChart();
      this.buildChartDebts(); // <- adicionado
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
            backgroundColor: this.marcas.map((m) => m.cor), // usa cor da marca
          },
        ],
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  buildChartDebts(): void {
    const ctx = document.getElementById('chart-departamentos') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chartDebtsInstance) {
      this.chartDebtsInstance.destroy();
    }

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
        plugins: {
          legend: { display: false },
        },
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
