import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { BrandSales, PositivityByBrandResponse, VendedorDisplay, VendedorPositivacao } from '../models';

Chart.register(...registerables);

const CORES = [
  '#1B5E20', // verde escuro
  '#50CD89', // verde
  '#009EF7', // azul
  '#FFC700', // amarelo
  '#5E6278', // cinza escuro
  '#FF69B4', // pink
];
Chart.register({
  id: 'centerTextPlugin',
  beforeDraw(chart, args, options) {
    const {
      ctx,
      chartArea: { top, left, width, height },
    } = chart;
    const text = options?.text || '';

    ctx.save();
    ctx.font = `${options?.fontSize || 16}px sans-serif`;
    ctx.fillStyle = options?.fontColor || '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, left + width / 2, top + height / 2);
    ctx.restore();
  },
});

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
  graficoPositivacaoAzzo: 'geral' | 'contribuicao' = 'geral';
  viewMode: 'doughnut' | 'barra' = 'barra';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.brandSales = this.route.snapshot.data['brandSales'];
    this.positivity = this.route.snapshot.data['positivity'];
    console.log('posivitivy ==========>', this.positivity);

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
    this.renderChartsBarOnly();
  }

  renderChartsBarOnly() {
    this.createStackedBarChart('stacked-bar-chart', this.vendedores);

    if (this.positivity) {
      const { Azzo: _, ...positivitySemAzzo } = this.positivity;

      if (this.graficoPositivacao === 'geral') {
        setTimeout(() => this.positivacaoGeral('bar-chart-geral', positivitySemAzzo));
      } else {
        setTimeout(() => this.positivacaoPorMarca('bar-chart-marcas', positivitySemAzzo));
      }

      this.contribuicaoPorMarca('bar-chart-contribuicao', positivitySemAzzo);
      this.positivacaoAzzo('chart-positivacao-azzo', this.positivity);
      this.clientesAbsolutoPorMarcaAzzo('chart-clientes-azzo-contrib', _);
      this.clientesAbsolutoPorMarca('bar-chart-clientes-absolutos', positivitySemAzzo);
    }
  }

  onViewModeChange() {
    if (this.viewMode === 'doughnut') {
      setTimeout(() => {
        this.vendedores.forEach((vendedor, i) => {
          const ctx = document.getElementById('chart-' + i) as HTMLCanvasElement;
          const ctxPos = document.getElementById('positivacao-' + i) as HTMLCanvasElement;

          if (ctx) {
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
                plugins: { legend: { display: false } },
              },
            });
          }

          if (ctxPos && this.positivity?.[vendedor.nome]) {
            const posData = this.positivity[vendedor.nome];

            new Chart(ctxPos, {
              type: 'doughnut',
              data: {
                labels: ['Positivado', 'Não Positivado'],
                datasets: [
                  {
                    data: [posData.clientesPositivados, posData.totalClientes - posData.clientesPositivados],
                    backgroundColor: ['#50CD89', '#F1416C'],
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
              plugins: [
                {
                  id: 'centerTextPlugin',
                  beforeDraw(chart) {
                    const {
                      ctx,
                      chartArea: { top, left, width, height },
                    } = chart;
                    const text = posData.totalClientes > 1 ? `${posData.totalClientes} clientes` : 'S/ Carteira';
                    ctx.save();
                    ctx.font = 'bold 16px sans-serif';
                    ctx.fillStyle = '#000';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(text, left + width / 2, top + height / 2);
                    ctx.restore();
                  },
                },
              ],
            });
          }
        });
      }, 0);
    } else if (this.viewMode === 'barra') {
      // 🔥 Re-renderiza gráficos de barra ao voltar
      setTimeout(() => this.renderChartsBarOnly(), 0);
    }
  }

  createStackedBarChart(canvasId: string, vendedores: VendedorDisplay[]) {
    const vendedoresSemAzzo = vendedores.filter((v) => v.nome !== 'Azzo');
    const azzoData = vendedores.find((v) => v.nome === 'Azzo');

    const vendedoresOrdenados = vendedoresSemAzzo.sort((a, b) => b.totalFaturado - a.totalFaturado);

    const marcasUnicas = Array.from(new Set(vendedores.flatMap((v) => v.marcasList.map((m) => m.nome))));

    const marcaCorMap: Record<string, string> = {};
    marcasUnicas.forEach((marca, i) => {
      marcaCorMap[marca] = CORES[i % CORES.length];
    });

    const montarDatasets = (listaVendedores: VendedorDisplay[]) => {
      const rawDatasets = marcasUnicas.map((marca) => {
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
      plugins: [
        {
          id: 'totalLabelPlugin',
          afterDatasetsDraw(chart: Chart) {
            const ctx = chart.ctx;
            const labels = chart.data.labels as string[];
            if (!labels) return;

            const meta = chart.getDatasetMeta(5);

            labels.forEach((label, index) => {
              const vendedor = vendedoresOrdenados.find((v) => v.nome === label);
              if (!vendedor) return;

              const total = vendedor.totalFaturado;
              const bar = meta.data?.[index];
              if (!bar) return;

              const yPos = bar.y;
              const formattedTotal = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 0,
              }).format(total);

              ctx.save();
              ctx.font = 'bold 12px sans-serif';
              ctx.fillStyle = '#000';
              ctx.textAlign = 'center';
              ctx.fillText(formattedTotal, bar.x, yPos - 6);
              ctx.restore();
            });
          },
        },
      ],
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
                    const valor = typeof ctx.raw === 'number' ? ctx.raw : 0;
                    const valorFormatado = new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2,
                    }).format(valor);

                    return `${marca}: ${valorFormatado}`;
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
          plugins: [
            {
              id: 'totalLabelPlugin',
              afterDatasetsDraw(chart: Chart) {
                const ctx = chart.ctx;
                const meta = chart.getDatasetMeta(5);
                const bar = meta.data?.[0];
                if (!bar) return;

                const yPos = bar.y;
                const formattedTotal = new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  maximumFractionDigits: 0,
                }).format(azzoData.totalFaturado);

                ctx.save();
                ctx.font = 'bold 12px sans-serif';
                ctx.fillStyle = '#000';
                ctx.textAlign = 'center';
                ctx.fillText(formattedTotal, bar.x, yPos - 6);
                ctx.restore();
              },
            },
          ],
        });
      }, 100);
    }
  }

  positivacaoGeral(canvasId: string, data: PositivityByBrandResponse) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) return;

    // Ordenar labels com base nos clientes positivados (decrescente)
    const labels = Object.keys(data).sort((a, b) => {
      return (data[b]?.clientesPositivados || 0) - (data[a]?.clientesPositivados || 0);
    });

    const positivados = labels.map((vendedor) => data[vendedor]?.clientesPositivados || 0);
    const naoPositivados = labels.map((vendedor) => {
      const info = data[vendedor];
      if (!info || info.totalClientes === 1) return 0;
      return info.totalClientes - info.clientesPositivados;
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
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                const index = ctx.dataIndex;
                const total = positivados[index] + naoPositivados[index];
                const valor = ctx.raw as number;
                const percent = total > 1 ? ((valor / total) * 100).toFixed(2) : '';
                const suffix = percent ? ` (${percent}%)` : '';
                return `${ctx.dataset.label}: ${valor} clientes${suffix}`;
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
      plugins: [
        {
          id: 'totalLabelPlugin',
          afterDatasetsDraw(chart: Chart) {
            const ctx = chart.ctx;
            const chartLabels = chart.data.labels as string[];
            if (!chartLabels) return;

            const meta2 = chart.getDatasetMeta(1); // Segunda pilha: Não Positivados

            chartLabels.forEach((label, index) => {
              const bar = meta2.data?.[index];
              const vendedor = data[label];
              if (!bar || !vendedor) return;

              const x = bar.x;
              const y = bar.y;
              const texto = vendedor.totalClientes > 1 ? `${vendedor.totalClientes} clientes` : 'S/ Carteira';

              ctx.save();
              ctx.font = 'bold 12px sans-serif';
              ctx.fillStyle = '#000';
              ctx.textAlign = 'center';
              ctx.fillText(texto, x, y - 6);
              ctx.restore();
            });
          },
        },
      ],
    });
  }

  positivacaoPorMarca(canvasId: string, data: PositivityByBrandResponse) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) return;

    // Ordenar vendedores pelo total de clientes positivados
    const vendedores = Object.keys(data)
      .filter((v) => data[v]?.totalClientes > 1)
      .sort((a, b) => {
        return (data[b]?.clientesPositivados || 0) - (data[a]?.clientesPositivados || 0);
      });

    // Coletar todas as marcas existentes
    const marcasSet = new Set<string>();
    vendedores.forEach((vendedor) => {
      Object.keys(data[vendedor].marcas).forEach((marca) => marcasSet.add(marca));
    });
    const marcas = Array.from(marcasSet);

    // Criar datasets com vendedores já ordenados
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
              label: (ctx) => {
                const rawVendedor = ctx.chart.data.labels?.[ctx.dataIndex];
                const vendedor = typeof rawVendedor === 'string' ? rawVendedor : '';
                const marca = ctx.dataset.label || '';
                const positivados = data[vendedor as keyof PositivityByBrandResponse]?.marcas?.[marca]?.clientesPositivados || 0;
                const percent = ctx.raw as number;
                return `${marca}: ${positivados} clientes (${percent.toFixed(2)}%)`;
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
              label: (ctx) => {
                const vendedor = ctx.chart.data.labels?.[ctx.dataIndex] as string;
                const marca = ctx.dataset.label || '';
                const positivados = data[vendedor]?.marcas?.[marca]?.clientesPositivados || 0;
                const percent = ctx.raw as number;
                return `${marca}: ${positivados} clientes (${percent.toFixed(2)}%)`;
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
          x: { stacked: true },
          y: {
            stacked: true,
            ticks: { precision: 0 },
          },
        },
      },
      plugins: [
        {
          id: 'totalLabelPlugin',
          afterDatasetsDraw(chart: Chart) {
            const ctx = chart.ctx;
            const meta = chart.getDatasetMeta(1);
            const bar = meta.data?.[0];
            if (!bar) return;

            const yPos = bar.y;
            const totalClientes = data['Azzo'].totalClientes;
            const formattedTotal = `${totalClientes} clientes`;

            ctx.save();
            ctx.font = 'bold 12px sans-serif';
            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.fillText(formattedTotal, bar.x, yPos - 6);
            ctx.restore();
          },
        },
      ],
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
    } else if (this.graficoPositivacao === 'clientesContribuicao') {
      setTimeout(() => {
        this.clientesAbsolutoPorMarca('bar-chart-clientes-absolutos', positivitySemAzzo);
        this.clientesAbsolutoPorMarcaAzzo('chart-positivacao-azzo', _);
      });
    }
  }

  positivityAzzoChange() {
    if (this.graficoPositivacaoAzzo === 'geral') {
      setTimeout(() => this.positivacaoAzzo('chart-positivacao-azzo', this.positivity || {}));
    } else if (this.graficoPositivacaoAzzo === 'contribuicao') {
      setTimeout(() => this.clientesAbsolutoPorMarcaAzzo('chart-clientes-azzo-contrib', this.positivity?.Azzo));
    }
  }

  clientesAbsolutoPorMarca(canvasId: string, data: PositivityByBrandResponse) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) return;

    const vendedores = Object.keys(data).sort((a, b) => (data[b]?.clientesPositivados || 0) - (data[a]?.clientesPositivados || 0));

    const marcasSet = new Set<string>();
    vendedores.forEach((vendedor) => {
      Object.keys(data[vendedor]?.marcas || {}).forEach((marca) => marcasSet.add(marca));
    });

    const marcas = Array.from(marcasSet);
    const maxTotalPositivados = Math.max(...vendedores.map((v) => data[v]?.clientesPositivados || 0));

    // Cria matriz transposta com marca por vendedor
    const pilhasPorVendedor: Record<string, { marca: string; valor: number; cor: string; contrib: number }[]> = {};

    vendedores.forEach((vendedor) => {
      pilhasPorVendedor[vendedor] = marcas
        .map((marca) => ({
          marca,
          valor: data[vendedor]?.marcas?.[marca]?.clientesPositivados || 0,
          contrib: data[vendedor]?.marcas?.[marca]?.contribuicaoPercentual || 0,
          cor: this.marcaCorMap[marca] || '#999999',
        }))
        .filter((m) => m.valor > 0)
        .sort((a, b) => b.valor - a.valor);
    });

    // Cria datasets ordenando as marcas individualmente por vendedor
    const datasets: any[] = [];

    marcas.forEach((_, stackIndex) => {
      const dataset = {
        label: '',
        data: [] as number[],
        contribPercent: [] as number[],
        backgroundColor: '' as string,
      };

      vendedores.forEach((vendedor) => {
        const pilha = pilhasPorVendedor[vendedor][stackIndex];
        dataset.data.push(pilha?.valor || 0);
        dataset.contribPercent.push(pilha?.contrib || 0);
        if (!dataset.label && pilha) {
          dataset.label = pilha.marca;
          dataset.backgroundColor = pilha.cor;
        }
      });

      if (dataset.data.some((v) => v > 0)) {
        datasets.push(dataset);
      }
    });

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: vendedores,
        datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const marca = ctx.dataset.label || '';
                const valor = ctx.raw as number;
                const contrib = (ctx.dataset as any).contribPercent?.[ctx.dataIndex] || 0;
                return `${marca}: ${valor} clientes (${contrib.toFixed(2)}%)`;
              },
            },
          },
        },
        scales: {
          x: { stacked: true },
          y: {
            stacked: true,
            suggestedMax: maxTotalPositivados + 5,
            title: {
              display: true,
              text: 'Clientes Positivados por Marca',
            },
            ticks: {
              stepSize: 10,
            },
          },
        },
      },
      plugins: [
        {
          id: 'totalLabelPlugin',
          afterDatasetsDraw(chart: Chart) {
            const ctx = chart.ctx;
            const labels = chart.data.labels as string[];
            if (!labels) return;

            const meta = chart.getDatasetMeta(5);
            labels.forEach((label, index) => {
              const total = data[label]?.clientesPositivados || 0;
              const bar = meta.data?.[index];
              if (!bar) return;

              const yPos = bar.y;
              ctx.save();
              ctx.font = 'bold 12px sans-serif';
              ctx.fillStyle = '#000';
              ctx.textAlign = 'center';
              ctx.fillText(`${total}`, bar.x, yPos - 6);
              ctx.restore();
            });
          },
        },
      ],
    });
  }

  clientesAbsolutoPorMarcaAzzo(canvasId: string, data: VendedorPositivacao | undefined) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx || !data) return;

    const marcas = Object.keys(data.marcas);

    const dataset = marcas.map((marca) => {
      const contrib = data.marcas[marca]?.contribuicaoPercentual || 0;
      return {
        label: marca,
        data: [(data.clientesPositivados || 0) * (contrib / 100)],
        backgroundColor: this.marcaCorMap[marca] || '#999999',
        contribPercent: contrib,
      };
    });

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Azzo'],
        datasets: dataset,
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const marca = ctx.dataset.label || '';
                const valor = ctx.raw as number;
                const percent = (ctx.dataset as any).contribPercent || 0;
                const total = data.clientesPositivados || 0;

                return `${marca}: ${valor.toFixed(0)} clientes (${percent.toFixed(2)}% de ${total})`;
              },
            },
          },
        },
        scales: {
          x: { stacked: true },
          y: {
            stacked: true,
            title: {
              display: true,
              text: 'Clientes Positivados (Azzo)',
            },
            ticks: {
              stepSize: 10,
            },
          },
        },
      },
    });
  }

  getTituloPositivacao(): string {
    switch (this.graficoPositivacao) {
      case 'geral':
        return 'Positivação Geral por Vendedor';
      case 'porMarca':
        return 'Positivação Marca / Carteira';
      case 'contribuicao':
        return 'Contribuição por Marca na Positivação';
      default:
        return 'Positivação Geral por Vendedor';
    }
  }
}
