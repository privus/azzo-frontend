import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExportService } from '../../../_metronic/layout/core/export.service';
import { SellerBonus, WeeklyBonusDetails, WeeklyBonus } from '../models';
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
      this.WeeklyBonusDetails();
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

  WeeklyBonusDetails(): void {
    const today = new Date();

    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - today.getDay() - 7);

    const nextSaturday = new Date(lastSunday);
    nextSaturday.setDate(lastSunday.getDate() + 6);

    const formattedFrom = lastSunday.toISOString().split('T')[0];
    const formattedTo = nextSaturday.toISOString().split('T')[0];

    this.sellersService.getWeeklyAidDetails(formattedFrom, formattedTo).subscribe({
      next: (data: WeeklyBonusDetails) => {
        console.log('WeeklyAidDetails:', data);

        // 🔒 proteção total
        if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
          alert('Nenhum dado encontrado.');
          return;
        }

        const sheets: { [sheetName: string]: XLSX.WorkSheet } = {};

        for (const vendedorNome of Object.keys(data)) {
          const vendedor = data[vendedorNome];

          // 🔒 garante estrutura
          if (!vendedor) continue;

          const pedidos50 = vendedor.pedidos_50 ?? [];
          const pedidos30 = vendedor.pedidos_30 ?? [];
          const valorInvalido = vendedor.valor_invalido ?? [];
          const intervaloInvalido = vendedor.intervalo_invalido ?? [];

          const linhas: any[] = [];

          // ✅ PEDIDOS 50
          pedidos50.forEach((id: number) => {
            linhas.push({ Codigo: id, Tipo: '50' });
          });

          // ✅ PEDIDOS 30
          pedidos30.forEach((id: number) => {
            linhas.push({ Codigo: id, Tipo: '30' });
          });

          // ❌ INVALIDOS VALOR
          valorInvalido.forEach((id: number) => {
            linhas.push({ Codigo: id, Tipo: 'Valor Inválido' });
          });

          // ❌ INVALIDOS INTERVALO
          intervaloInvalido.forEach((id: number) => {
            linhas.push({ Codigo: id, Tipo: 'Intervalo Inválido' });
          });

          linhas.sort((a, b) => a.Tipo.localeCompare(b.Tipo));

          // 🔥 RESUMO FINAL
          linhas.push(
            { Codigo: 'TOTAL', Tipo: '' },
            { Codigo: 'Valor Total', Tipo: vendedor.valor_total ?? 0 },
            { Codigo: 'Pedidos', Tipo: vendedor.pedidos ?? 0 },
            { Codigo: 'Clientes Novos', Tipo: vendedor.clientes_novos ?? 0 },
          );

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
