import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { BrandSales, VendedorDisplay } from '../models';

Chart.register(...registerables);

const CORES = [
  '#50CD89', // verde
  '#009EF7', // azul
  '#7239EA', // roxo
  '#F1416C', // vermelho
  '#A1A5B7', // cinza
  '#FF5733', // vermelho queimado
  '#FFC700', // amarelo
  '#5E6278', // cinza escuro
  '#FF69B4', // pink
  '#2ECC71', // verde claro
  '#1ABC9C', // verde água
];

@Component({
  selector: 'app-positivity',
  templateUrl: './positivity.component.html',
  styleUrls: ['./positivity.component.scss'],
})
export class PositivityComponent implements OnInit, AfterViewInit {
  brandSales: BrandSales | null = null;
  vendedores: VendedorDisplay[] = [];
  topSellerName: string = '';
  marcaCorMap: Record<string, string> = {}; // <- Mapa global de cores por marca
  corIndex = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.brandSales = this.route.snapshot.data['brandSales'];
    console.log('Brand Sales:', this.brandSales);

    if (this.brandSales) {
      const allMarcas = new Set<string>();

      // Coleta todas as marcas únicas (exceto Azzo)
      Object.values(this.brandSales).forEach((vendedor) => {
        Object.keys(vendedor.marcas).forEach((marca) => allMarcas.add(marca));
      });

      // Atribui uma cor única para cada marca
      allMarcas.forEach((marca) => {
        this.marcaCorMap[marca] = CORES[this.corIndex % CORES.length];
        this.corIndex++;
      });

      // Prepara estrutura de vendedores para exibir no gráfico
      this.vendedores = Object.entries(this.brandSales).map(([nome, vendedor]) => {
        const marcasList = Object.entries(vendedor.marcas).map(([marca, data]) => ({
          nome: marca,
          valor: data.valor,
          cor: this.marcaCorMap[marca] || '#999999',
        }));

        return {
          nome,
          totalFaturado: vendedor.totalFaturado,
          totalPedidos: vendedor.totalPedidos,
          marcasList,
        };
      });
    }

    this.topSellerName = this.vendedores
      .filter((vendedor) => vendedor.nome !== 'Azzo')
      .reduce((max, current) => (current.totalFaturado > max.totalFaturado ? current : max)).nome;
  }

  ngAfterViewInit(): void {
    this.vendedores.forEach((vendedor, i) => {
      const ctx = document.getElementById('chart-' + i) as HTMLCanvasElement;
      if (!ctx) return;

      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: vendedor.marcasList.map((m) => m.nome),
          datasets: [
            {
              data: vendedor.marcasList.map((m) => m.valor),
              backgroundColor: vendedor.marcasList.map((m) => m.cor),
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
    });
    this.createStackedBarChart('stacked-bar-chart', this.vendedores);
  }

  createStackedBarChart(canvasId: string, vendedores: VendedorDisplay[]) {
    const marcasUnicas = Array.from(new Set(vendedores.flatMap((v: VendedorDisplay) => v.marcasList.map((m: { nome: string }) => m.nome))));

    const marcaCorMap: Record<string, string> = {};
    marcasUnicas.forEach((marca, i) => {
      marcaCorMap[marca] = CORES[i % CORES.length];
    });

    // Cria os datasets com os dados de cada marca
    const rawDatasets = marcasUnicas.map((marca: string) => {
      const data = vendedores.map((v) => {
        const marcaData = v.marcasList.find((m) => m.nome === marca);
        return marcaData ? marcaData.valor : 0;
      });

      const total = data.reduce((sum, val) => sum + val, 0);

      return {
        label: marca,
        backgroundColor: marcaCorMap[marca],
        data,
        totalFaturamento: total,
      };
    });

    // Ordena da menor para a maior
    const datasets = rawDatasets
      .sort((a, b) => b.totalFaturamento - a.totalFaturamento)
      .map(({ label, backgroundColor, data }) => ({
        label,
        backgroundColor,
        data,
      }));

    new Chart(document.getElementById(canvasId) as HTMLCanvasElement, {
      type: 'bar',
      data: {
        labels: vendedores.map((v) => v.nome),
        datasets: datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                const marca = ctx.dataset.label || '';
                const value = typeof ctx.raw === 'number' ? ctx.raw : 0;
                return `${marca}: R$ ${value.toFixed(2)}`;
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            ticks: {
              callback: (val) => `R$ ${val}`,
            },
          },
        },
      },
    });
  }
}
