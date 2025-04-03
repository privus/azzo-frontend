import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { BrandSales, VendedorDisplay } from '../models';

Chart.register(...registerables);

const CORES = ['#50CD89', '#009EF7', '#FFC700', '#F1416C', '#7239EA', '#3E97FF', '#FFA800', '#5E6278', '#FF5733', '#2ECC71', '#1ABC9C'];

@Component({
  selector: 'app-positivity',
  templateUrl: './positivity.component.html',
  styleUrls: ['./positivity.component.scss'],
})
export class PositivityComponent implements OnInit, AfterViewInit {
  brandSales: BrandSales | null = null;
  vendedores: VendedorDisplay[] = [];
  topSellerName: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.brandSales = this.route.snapshot.data['brandSales'];
    console.log('Brand Sales:', this.brandSales);

    if (this.brandSales) {
      this.vendedores = Object.entries(this.brandSales).map(([nome, vendedor]) => {
        const marcasList = Object.entries(vendedor.marcas).map(([marca, data], i) => ({
          nome: marca,
          valor: data.valor,
          cor: CORES[i % CORES.length],
        }));

        return {
          nome,
          totalFaturado: vendedor.totalFaturado,
          totalPedidos: vendedor.totalPedidos,
          marcasList,
        };
      });
    }

    this.topSellerName = this.vendedores.reduce((max, current) => (current.totalFaturado > max.totalFaturado ? current : max)).nome;
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
