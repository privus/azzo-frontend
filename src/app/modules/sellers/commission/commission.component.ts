import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Commissions, CommissionsReport } from '../models';
import { ActivatedRoute } from '@angular/router';
import { SellersService } from '../services/sellers.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss'],
})
export class CommissionsComponent implements OnInit {
  comission: Commissions[] = [];
  commissionsDetailed: CommissionsReport[] = [];
  dataRange: string = 'thisMonth';
  showCustomDatePicker = false;

  customDateRange = { start: '', end: '' };

  constructor(
    private route: ActivatedRoute,
    private sellersService: SellersService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.dateRange(); // Inicializa customDateRange com base em dataRange

    const commissions = this.route.snapshot.data['commissions'];
    console.log('COMMISSIONS ===> ', commissions);

    this.comission = Array.isArray(commissions) ? commissions.sort((a, b) => b.faturado - a.faturado) : [];
  }

  private dateRange(): void {
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (this.dataRange) {
      case 'custom':
        return;

      case 'yesterday':
        startDate.setDate(now.getDate() - 1);
        endDate = new Date(startDate);
        break;

      case 'last7':
        startDate.setDate(now.getDate() - 7);
        endDate = now;
        break;

      case 'last15':
        startDate.setDate(now.getDate() - 15);
        endDate = now;
        break;

      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;

      case 'lastWeek':
        const dayOfWeek = now.getDay();
        startDate.setDate(now.getDate() - dayOfWeek - 7);
        endDate.setDate(now.getDate() - dayOfWeek - 1);
        break;

      case 'thisMonth':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = now;
        break;
    }

    this.customDateRange.start = this.formatDate(startDate);
    this.customDateRange.end = this.formatDate(endDate);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private parseLocalDate(iso: string): Date {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  private fetchCommissions(fromDate: string, toDate?: string): void {
    this.sellersService.getCommissions(fromDate, toDate).subscribe({
      next: (res) => {
        this.comission = res.sort((a, b) => b.faturado - a.faturado);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao buscar comissões:', err),
    });
  }

  onDateRange(): void {
    if (this.dataRange === 'custom') {
      this.showCustomDatePicker = true;

      if (!this.customDateRange.start) return;

      const fromDate = this.formatDate(this.parseLocalDate(this.customDateRange.start));
      const toDate = this.customDateRange.end ? this.formatDate(this.parseLocalDate(this.customDateRange.end)) : fromDate;

      this.fetchCommissions(fromDate, toDate);
    } else {
      this.showCustomDatePicker = false;

      this.dateRange(); // Atualiza o customDateRange com base em dataRange

      const fromDate = this.customDateRange.start;
      const toDate = this.customDateRange.end;

      this.fetchCommissions(fromDate, toDate);
    }
  }

  get comissionSorted(): Commissions[] {
    return [...this.comission].sort((a, b) => b.faturado - a.faturado);
  }

  downloadExcel(): void {
    let fromDate: string;
    let toDate: string;

    if (this.dataRange === 'custom') {
      if (!this.customDateRange.start) {
        alert('Selecione uma data inicial válida.');
        return;
      }

      fromDate = this.formatDate(this.parseLocalDate(this.customDateRange.start));
      toDate = this.customDateRange.end ? this.formatDate(this.parseLocalDate(this.customDateRange.end)) : fromDate;
    } else {
      this.dateRange(); // Garante que customDateRange está atualizado
      fromDate = this.customDateRange.start;
      toDate = this.customDateRange.end;
    }

    this.sellersService.getCommissionsReport(fromDate, toDate).subscribe({
      next: (data) => {
        console.log('Dados do relatório detalhado de comissões:', data);
        if (!data || data.length === 0) {
          alert('Nenhuma comissão encontrada no período.');
          return;
        }

        const sheets: { [sheetName: string]: XLSX.WorkSheet } = {};

        for (const vendedor of data) {
          const vendasFormatadas = vendedor.vendas.map((v) => ({
            codigo: String(v.codigo),
            Data: new Date(v.data_criacao).toLocaleDateString(),
            'Valor Final': v.valor_final,
            Comissão: v.comisao,
          }));

          vendasFormatadas.push({
            codigo: 'TOTAL',
            Data: '',
            'Valor Final': vendedor.total_valor_final,
            Comissão: vendedor.total_comisao,
          });

          sheets[vendedor.vendedor_nome] = XLSX.utils.json_to_sheet(vendasFormatadas);
        }

        const workbook: XLSX.WorkBook = {
          Sheets: sheets,
          SheetNames: Object.keys(sheets),
        };

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        saveAs(blob, `relatorio_comissoes_${fromDate}_a_${toDate}.xlsx`);
      },
      error: (err) => {
        console.error('Erro ao baixar relatório detalhado:', err);
        alert('Erro ao gerar o relatório detalhado de comissões.');
      },
    });
  }
}
