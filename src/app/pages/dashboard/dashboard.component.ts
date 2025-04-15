import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalesComparisonReport } from '../models/performance.modal';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  salesPerformance: SalesComparisonReport;
  marcas: { nome: string; valor: number; cor: string }[] = [];
  percentualPermance: number = 0;
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
    const faturamento = this.salesPerformance.faturamentoPorMarcaMesAtual;

    // Ordem fixa das marcas com suas cores definidas
    const ordemMarcas = ['H2O', 'Green', 'Viceroy', 'Purelli', 'Black Fix', 'Vidal'];

    // Atribui marca, valor e cor conforme ordem fixa
    this.marcas = ordemMarcas
      .filter((nome) => faturamento[nome] !== undefined)
      .map((nome, index) => ({
        nome,
        valor: faturamento[nome],
        cor: this.CORES[index],
      }))
      // 🔽 ordena visualização por valor crescente
      .sort((a, b) => a.valor - b.valor);

    this.percentualPermance = this.salesPerformance.variacaoPercentual - 100;
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.buildChart(), 0);
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

  getBadgeClass(): string {
    switch (this.salesPerformance.direcao) {
      case 'aumento':
        return 'badge-light-success';
      case 'queda':
        return 'badge-light-danger';
      default:
        return 'badge-light-secondary';
    }
  }

  getBadgeIcon(): string {
    switch (this.salesPerformance.direcao) {
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
