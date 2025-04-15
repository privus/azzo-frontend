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
  marcas: { nome: string; valor: number }[] = [];
  percentualPermance: number = 0;
  readonly CORES = [
    '#1B5E20', // verde escuro
    '#50CD89', // verde
    '#009EF7', // azul
    '#FFC700', // amarelo
    '#5E6278', // cinza escuro
    '#FF69B4', // pink
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.salesPerformance = this.route.snapshot.data['salesPerformance'];

    this.marcas = Object.entries(this.salesPerformance.faturamentoPorMarcaMesAtual).map(([nome, valor]) => ({
      nome,
      valor,
    }));
    const entries = Object.entries(this.salesPerformance.faturamentoPorMarcaMesAtual);

    // Garante que a ordem das marcas siga a ordem das cores
    this.marcas = entries.map(([nome, valor], index) => ({
      nome,
      valor,
      cor: this.CORES[index % this.CORES.length],
    }));

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
            backgroundColor: this.marcas.map((_, i) => this.CORES[i % this.CORES.length]),
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
