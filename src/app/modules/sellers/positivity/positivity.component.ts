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
  '#FFC700', // amarelo
  '#A1A5B7', // cinza
  '#FFA800', // laranja
  '#5E6278', // cinza escuro
  '#FF5733', // vermelho queimado
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
  }
}
