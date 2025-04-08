import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { BrandSales, PositivityByBrandResponse, VendedorDisplay } from '../models';

Chart.register(...registerables);

const CORES = [
  '#1B5E20', // verde escuro
  '#50CD89', // verde
  '#009EF7', // azul
  '#FFC700', // amarelo
  '#5E6278', // cinza escuro
  '#FF69B4', // pink
];

@Component({
  selector: 'app-positivity',
  templateUrl: './positivity.component.html',
  styleUrls: ['./positivity.component.scss'],
})
export class PositivityComponent implements OnInit, AfterViewInit {
  brandSales: BrandSales | null = null;
  positivity: PositivityByBrandResponse | null = null;
  vendedores: VendedorDisplay[] = [];
  topSellerName: string = '';
  marcaCorMap: Record<string, string> = {}; // <- Mapa global de cores por marca
  corIndex = 0;
  graficoPositivacao: 'geral' | 'porMarca' | 'contribuicao' = 'geral';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.brandSales = this.route.snapshot.data['brandSales'];
    this.positivity = this.route.snapshot.data['positivity'];
    console.log('Positivity ======================>', this.positivity);

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
    this.renderAllCharts();
  }

  renderAllCharts() {
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

    if (this.positivity) {
      const { Azzo: _, ...positivitySemAzzo } = this.positivity;

      // Renderiza o gráfico inicialmente com o que estiver selecionado
      if (this.graficoPositivacao === 'geral') {
        setTimeout(() => this.positivacaoGeral('bar-chart-geral', positivitySemAzzo));
      } else {
        setTimeout(() => this.positivacaoPorMarca('bar-chart-marcas', positivitySemAzzo));
      }

      this.contribuicaoPorMarca('bar-chart-contribuicao', positivitySemAzzo);
      this.positivacaoAzzo('chart-positivacao-azzo', this.positivity);
    }
  }

  createStackedBarChart(canvasId: string, vendedores: VendedorDisplay[]) {
    const vendedoresSemAzzo = vendedores.filter((v) => v.nome !== 'Azzo');
    const azzoData = vendedores.find((v) => v.nome === 'Azzo');

    // Ordena os vendedores por totalFaturado (maior -> menor)
    const vendedoresOrdenados = vendedoresSemAzzo.sort((a, b) => b.totalFaturado - a.totalFaturado);

    const marcasUnicas = Array.from(new Set(vendedores.flatMap((v: VendedorDisplay) => v.marcasList.map((m: { nome: string }) => m.nome))));

    const marcaCorMap: Record<string, string> = {};
    marcasUnicas.forEach((marca, i) => {
      marcaCorMap[marca] = CORES[i % CORES.length];
    });

    const montarDatasets = (listaVendedores: VendedorDisplay[]) => {
      const rawDatasets = marcasUnicas.map((marca: string) => {
        const data = listaVendedores.map((v) => {
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

      return rawDatasets
        .sort((a, b) => b.totalFaturamento - a.totalFaturamento)
        .map(({ label, backgroundColor, data }) => ({
          label,
          backgroundColor,
          data,
        }));
    };

    // === Gráfico principal (sem Azzo) ===
    new Chart(document.getElementById(canvasId) as HTMLCanvasElement, {
      type: 'bar',
      data: {
        labels: vendedoresOrdenados.map((v) => v.nome),
        datasets: montarDatasets(vendedoresOrdenados),
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
                const formattedValue = new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 2,
                }).format(value);
                return `${marca}: ${formattedValue}`;
              },
            },
          },
        },
        scales: {
          x: { stacked: true },
          y: {
            stacked: true,
            ticks: {
              callback: (val) =>
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  maximumFractionDigits: 0,
                }).format(Number(val)),
            },
          },
        },
      },
    });

    // === Gráfico separado da Azzo ===
    if (azzoData) {
      setTimeout(() => {
        const azzoCanvas = document.getElementById('chart-azzo') as HTMLCanvasElement;
        if (!azzoCanvas) return;

        new Chart(azzoCanvas, {
          type: 'bar',
          data: {
            labels: [azzoData.nome],
            datasets: montarDatasets([azzoData]),
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
                    const formattedValue = new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2,
                    }).format(value);
                    return `${marca}: ${formattedValue}`;
                  },
                },
              },
            },
            scales: {
              x: { stacked: true },
              y: {
                stacked: true,
                ticks: {
                  callback: (val) =>
                    new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      maximumFractionDigits: 0,
                    }).format(Number(val)),
                },
              },
            },
          },
        });
      }, 100); // aguarda render da view
    }
  }

  positivacaoGeral(canvasId: string, data: PositivityByBrandResponse) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) return;

    const labels = Object.keys(data);

    const positivados: number[] = [];
    const naoPositivados: number[] = [];
    const totalClientes: number[] = [];

    labels.forEach((vendedor) => {
      const info = data[vendedor];
      positivados.push(info.clientesPositivados);
      const naoPositivado = info.totalClientes - info.clientesPositivados;
      naoPositivados.push(naoPositivado);
      totalClientes.push(info.totalClientes);
    });

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Clientes Positivados',
            data: positivados,
            backgroundColor: '#50CD89',
          },
          {
            label: 'Clientes Não Positivados',
            data: naoPositivados,
            backgroundColor: '#F1416C',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (ctx) {
                const index = ctx.dataIndex;
                const total = positivados[index] + naoPositivados[index];
                const valor = ctx.raw as number;
                const percent = ((valor / total) * 100).toFixed(2);
                return `${ctx.dataset.label}: ${valor} clientes (${percent}%)`;
              },
            },
          },
          legend: {
            position: 'top',
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            ticks: {
              precision: 0,
            },
          },
        },
      },
    });
  }

  positivacaoPorMarca(canvasId: string, data: PositivityByBrandResponse) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) return;

    const vendedores = Object.keys(data);
    const marcasSet = new Set<string>();

    // Coletar todas as marcas
    vendedores.forEach((vendedor) => {
      Object.keys(data[vendedor].marcas).forEach((marca) => marcasSet.add(marca));
    });

    const marcas = Array.from(marcasSet);

    // Criar datasets onde cada dataset é uma marca
    const datasets = marcas.map((marca) => {
      return {
        label: marca,
        data: vendedores.map((vendedor) => data[vendedor].marcas[marca]?.positivacaoMarca || 0),
        backgroundColor: this.marcaCorMap[marca] || '#999999',
      };
    });

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: vendedores, // Cada barra será um vendedor
        datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                const val = ctx.raw as number;
                return `${ctx.dataset.label}: ${val.toFixed(2)}%`;
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
            suggestedMax: 100,
            ticks: {
              callback: (val) => `${val}%`,
            },
          },
        },
      },
    });
  }

  contribuicaoPorMarca(canvasId: string, data: PositivityByBrandResponse) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) return;

    const vendedores = Object.keys(data);

    // Para cada vendedor, criar uma lista de marcas com contribuição
    const dadosPorVendedor: {
      [vendedor: string]: { marca: string; valor: number; cor: string }[];
    } = {};

    const todasMarcas = new Set<string>();

    vendedores.forEach((vendedor) => {
      const marcasObj = data[vendedor].marcas;
      const marcaList = Object.entries(marcasObj)
        .map(([marca, info]) => {
          todasMarcas.add(marca);
          return {
            marca,
            valor: info.contribuicaoPercentual,
            cor: this.marcaCorMap[marca] || '#999999',
          };
        })
        .sort((a, b) => b.valor - a.valor); // Ordena por contribuição

      dadosPorVendedor[vendedor] = marcaList;
    });

    const marcasOrdenadas = Array.from(todasMarcas);

    // Agora criamos os datasets manualmente
    const datasets: any[] = [];

    marcasOrdenadas.forEach((marca) => {
      const data: number[] = [];
      const backgroundColor: string[] = [];

      vendedores.forEach((vendedor) => {
        const marcaInfo = dadosPorVendedor[vendedor].find((m) => m.marca === marca);
        data.push(marcaInfo ? marcaInfo.valor : 0);
        backgroundColor.push(this.marcaCorMap[marca] || '#999999');
      });

      datasets.push({
        label: marca,
        data,
        backgroundColor: this.marcaCorMap[marca] || '#999999',
      });
    });

    // Reordena os datasets dentro de cada barra (vendedor)
    // Precisamos transpor os dados para aplicar ordenação por valor por vendedor
    const datasetsOrdenados: any[] = [];

    vendedores.forEach((vendedor, index) => {
      const marcaValores = datasets
        .map((ds) => ({
          label: ds.label,
          valor: ds.data[index],
          backgroundColor: ds.backgroundColor,
        }))
        .filter((m) => m.valor > 0)
        .sort((a, b) => b.valor - a.valor);

      marcaValores.forEach((marcaData, i) => {
        if (!datasetsOrdenados[i]) {
          datasetsOrdenados[i] = {
            label: marcaData.label,
            data: new Array(vendedores.length).fill(0),
            backgroundColor: this.marcaCorMap[marcaData.label] || '#999999',
          };
        }

        datasetsOrdenados[i].data[index] = marcaData.valor;
      });
    });

    // Renderiza o gráfico
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: vendedores,
        datasets: datasetsOrdenados,
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                const val = ctx.raw as number;
                return `${ctx.dataset.label}: ${val.toFixed(2)}%`;
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
            suggestedMax: 100,
            ticks: {
              callback: (val) => `${val}%`,
            },
          },
        },
      },
    });
  }

  positivacaoAzzo(canvasId: string, data: PositivityByBrandResponse) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx || !data['Azzo']) return;

    const info = data['Azzo'];
    const positivados = info.clientesPositivados;
    const total = info.totalClientes;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Azzo'],
        datasets: [
          {
            label: 'Clientes Positivados',
            data: [positivados],
            backgroundColor: '#50CD89',
          },
          {
            label: 'Clientes Não Positivados',
            data: [total - positivados],
            backgroundColor: '#F1416C',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const valor = ctx.raw as number;
                const percent = ((valor / total) * 100).toFixed(2);
                return `${ctx.dataset.label}: ${valor} clientes (${percent}%)`;
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
              precision: 0,
            },
          },
        },
      },
    });
  }

  positivityChange() {
    const { Azzo: _, ...positivitySemAzzo } = this.positivity || {};

    if (this.graficoPositivacao === 'geral') {
      setTimeout(() => this.positivacaoGeral('bar-chart-geral', positivitySemAzzo));
    } else if (this.graficoPositivacao === 'porMarca') {
      setTimeout(() => this.positivacaoPorMarca('bar-chart-marcas', positivitySemAzzo));
    } else if (this.graficoPositivacao === 'contribuicao') {
      setTimeout(() => this.contribuicaoPorMarca('bar-chart-contribuicao', positivitySemAzzo));
    }
  }
}
