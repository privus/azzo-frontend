import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExportService } from '../../../_metronic/layout/core/export.service';
import { SellerBonus, WeeklyAidDetails, WeeklyBonus } from '../models';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { SellersService } from '../services/sellers.service';

@Component({
  selector: 'app-weekly-bonus',
  templateUrl: './weekly-bonus.component.html',
  styleUrls: ['./weekly-bonus.component.scss'],
})
export class WeeklyBonusComponent implements OnInit {
  sellers: SellerBonus[] = [];

  constructor(
    private route: ActivatedRoute,
    private exportService: ExportService,
    private sellersService: SellersService,
  ) {}

  ngOnInit(): void {
    const data: WeeklyBonus = this.route.snapshot.data['bonus'];

    this.sellers = Object.entries(data).map(([sellerName, stats]) => ({
      ...stats,
      name: sellerName,
    }));
    this.exportService.onExport('weeklyBonus').subscribe(() => {
      this.downloadExcel();
    });
    this.exportService.onExport('weeklyBonusDetails').subscribe(() => {
      this.WeeklyAidDetails();
    });
  }

  downloadExcel(): void {
    const worksheetData = this.sellers.map((s) => ({
      Vendedor: s.name,
      Bônus: s.valor_total,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = { Sheets: { 'Bônus Semanais': worksheet }, SheetNames: ['Bônus Semanais'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'bonus_semanal.xlsx');
  }

  WeeklyAidDetails(): void {
    const today = new Date();

    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - today.getDay() - 7); // Sunday last week

    const nextSaturday = new Date(lastSunday);
    nextSaturday.setDate(lastSunday.getDate() + 6); // Saturday last week

    const formattedFrom = lastSunday.toISOString().split('T')[0];
    const formattedTo = nextSaturday.toISOString().split('T')[0];

    this.sellersService.getWeeklyAidDetails(formattedFrom, formattedTo).subscribe({
      next: (data: WeeklyAidDetails) => {
        console.log('WeeklyAidDetails:', data);

        if (!data || Object.keys(data).length === 0) {
          alert('Nenhum dado encontrado.');
          return;
        }

        const sheets: { [sheetName: string]: XLSX.WorkSheet } = {};

        for (const vendedorNome of Object.keys(data)) {
          const vendedor = data[vendedorNome];

          const linhas: any[] = [];

          // ✅ PEDIDOS 50
          vendedor.pedidos_50.forEach((id: number) => {
            linhas.push({
              Codigo: id,
              Tipo: '50',
            });
          });

          // ✅ PEDIDOS 30
          vendedor.pedidos_30.forEach((id: number) => {
            linhas.push({
              Codigo: id,
              Tipo: '30',
            });
          });

          // ❌ INVALIDOS VALOR
          vendedor.valor_invalido.forEach((id: number) => {
            linhas.push({
              Codigo: id,
              Tipo: 'Valor Inválido',
            });
          });

          // ❌ INVALIDOS INTERVALO
          vendedor.intervalo_invalido.forEach((id: number) => {
            linhas.push({
              Codigo: id,
              Tipo: 'Intervalo Inválido',
            });
          });
          linhas.sort((a, b) => a.Tipo.localeCompare(b.Tipo));

          // 🔥 RESUMO FINAL
          linhas.push({
            Codigo: 'TOTAL',
            Tipo: '',
          });

          linhas.push({
            Codigo: 'Valor Total',
            Tipo: vendedor.valor_total,
          });

          linhas.push({
            Codigo: 'Pedidos',
            Tipo: vendedor.pedidos,
          });

          linhas.push({
            Codigo: 'Clientes Novos',
            Tipo: vendedor.clientes_novos,
          });

          // cria sheet
          sheets[vendedorNome.substring(0, 31)] = XLSX.utils.json_to_sheet(linhas);
        }

        const workbook: XLSX.WorkBook = {
          Sheets: sheets,
          SheetNames: Object.keys(sheets),
        };

        const excelBuffer: any = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
        });

        const blob = new Blob([excelBuffer], {
          type: 'application/octet-stream',
        });

        saveAs(blob, `bonus_detalhado_${formattedFrom}_a_${formattedTo}.xlsx`);
      },
      error: (err) => {
        console.error('Erro ao gerar Excel:', err);
        alert('Erro ao gerar relatório.');
      },
    });
  }
}
