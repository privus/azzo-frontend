import { Component, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { FeatureCollection, Feature } from 'geojson';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as ApexCharts from 'apexcharts';

interface StateFeatureProperties {
  name: string;
  [key: string]: any;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  private root: am5.Root;

  constructor(
    private http: HttpClient,
    private zone: NgZone,
  ) {}

  ngAfterViewInit(): void {
    this.createMap();
    this.createChart();
    this.zone.runOutsideAngular(() => {
      this.criarGrafico();
    });
  }

  ngOnDestroy(): void {
    if (this.root) {
      this.root.dispose();
    }
  }

  loadGeoJSON(): Observable<FeatureCollection<GeoJSON.Geometry, StateFeatureProperties>> {
    return this.http.get<FeatureCollection<GeoJSON.Geometry, StateFeatureProperties>>('assets/brazil-states/brazil-states.geojson');
  }

  createMap() {
    this.loadGeoJSON().subscribe((brazilGeoJSON: FeatureCollection<GeoJSON.Geometry, StateFeatureProperties>) => {
      // Cria a instância do root
      this.root = am5.Root.new('kt_maps_widget_1_map');

      // Aplica o tema
      this.root.setThemes([am5themes_Animated.new(this.root)]);

      // Cria o mapa
      let chart = this.root.container.children.push(
        am5map.MapChart.new(this.root, {
          panX: 'none',
          panY: 'none',
          wheelX: 'none',
          wheelY: 'none',
          projection: am5map.geoMercator(),
        }),
      );

      // Filtra apenas Minas Gerais e São Paulo
      const statesToShow = ['Minas Gerais', 'São Paulo'];

      const filteredGeoJSON: FeatureCollection<GeoJSON.Geometry, StateFeatureProperties> = {
        type: 'FeatureCollection',
        features: brazilGeoJSON.features.filter((feature: Feature<GeoJSON.Geometry, StateFeatureProperties>) =>
          statesToShow.includes(feature.properties.name),
        ),
      };

      // Cria a série de polígonos com os estados filtrados
      let polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(this.root, {
          geoJSON: filteredGeoJSON,
        }),
      );

      // Configura os polígonos
      polygonSeries.mapPolygons.template.setAll({
        tooltipText: '{name}',
        interactive: true,
      });

      // Estado de hover
      polygonSeries.mapPolygons.template.states.create('hover', {
        fill: am5.color(0x677935),
      });

      // Centraliza e ajusta o zoom para os estados selecionados
      chart.appear(1000, 100);

      polygonSeries.events.on('datavalidated', function () {
        chart.goHome();
      });
    });
  }

  createChart() {
    const options = {
      chart: {
        type: 'bar',
        height: 350,
      },
      series: [
        {
          name: 'Categories',
          data: [15, 12, 10, 8, 7, 4, 3],
        },
      ],
      xaxis: {
        categories: ['Barbeadores', 'Higiene Pessoal', 'Higiene Bucal', 'Limpeza', 'Linha Infantil ', 'Alcool Gel', 'Bebidas'],
      },
      colors: [
        '#FF5733', // Phones
        '#33FF57', // Laptops
        '#3357FF', // Headsets
        '#FF33A8', // Games
        '#FFC733', // Keyboards
        '#33FFF5', // Monitors
        '#8E44AD', // Speakers
      ],
      plotOptions: {
        bar: {
          distributed: true,
          horizontal: false,
        },
      },
      dataLabels: {
        enabled: true,
      },
    };

    const chart = new ApexCharts(document.querySelector('#kt_charts_widget_5'), options);
    chart.render();
  }

  criarGrafico(): void {
    this.root = am5.Root.new('kt_charts_widget_13_chart');

    const chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
      }),
    );

    const xRenderer = am5xy.AxisRendererX.new(this.root, { minGridDistance: 30 });
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(this.root, {
        categoryField: 'year',
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(this.root, {}),
      }),
    );

    xAxis.data.setAll([{ year: '2017' }, { year: '2018' }, { year: '2019' }, { year: '2020' }, { year: '2021' }]);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        renderer: am5xy.AxisRendererY.new(this.root, {}),
      }),
    );

    this.criarSerie(chart, xAxis, yAxis, 'Higiene Pessoal', 'higienePessoal', '#FF5733', [1159, 1200, 1250, 1300, 1350]);
    this.criarSerie(chart, xAxis, yAxis, 'Higiene Bucal', 'higieneBucal', '#33FF57', [277, 300, 320, 340, 360]);
    this.criarSerie(chart, xAxis, yAxis, 'Limpeza', 'limpeza', '#3357FF', [71, 80, 85, 90, 95]);

    chart.set(
      'cursor',
      am5xy.XYCursor.new(this.root, {
        behavior: 'none',
      }),
    );

    chart.appear(1000, 100);
  }

  criarSerie(
    chart: am5xy.XYChart,
    xAxis: am5xy.CategoryAxis<am5xy.AxisRenderer>,
    yAxis: am5xy.ValueAxis<am5xy.AxisRenderer>,
    nome: string,
    campo: string,
    cor: string,
    valores: number[],
  ): void {
    const series = chart.series.push(
      am5xy.LineSeries.new(this.root, {
        name: nome,
        xAxis: xAxis,
        yAxis: yAxis,
        categoryXField: 'year',
        valueYField: campo,
        stroke: am5.color(cor),
        tooltip: am5.Tooltip.new(this.root, {
          labelText: '[bold]{name}[/]\n{categoryX}: {valueY}',
        }),
      }),
    );

    series.strokes.template.setAll({ strokeWidth: 2 });
    // Removed invalid property 'curveFactory'

    const seriesData = [
      { year: '2017', [campo]: valores[0] },
      { year: '2018', [campo]: valores[1] },
      { year: '2019', [campo]: valores[2] },
      { year: '2020', [campo]: valores[3] },
      { year: '2021', [campo]: valores[4] },
    ];

    series.data.setAll(seriesData);
  }
}
