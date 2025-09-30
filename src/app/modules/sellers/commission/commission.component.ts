import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Commissions } from '../models';
import { ActivatedRoute } from '@angular/router';
import { SellersService } from '../services/sellers.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss'],
})
export class CommissionsComponent implements OnInit {
  comission: Commissions[] = [];
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
    const snapCommissions = this.route.snapshot.data['commissions'];
    this.comission = Array.isArray(snapCommissions) ? snapCommissions.sort((a, b) => b.faturado - a.faturado) : [];

    console.log('Commissions ordenadas por faturado (snapshot):', this.comission);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onDateRange(): void {
    const selectedRange = this.dataRange;
    const now = new Date();

    let startDate = new Date(now);
    let endDate = new Date(now);

    if (selectedRange === 'custom') {
      this.showCustomDatePicker = true;

      const start = this.customDateRange.start;
      const end = this.customDateRange.end;

      if (!start) return; // Se não tem início, não faz nada

      const fromDate = this.formatDate(this.parseLocalDate(start));

      if (end) {
        const toDate = this.formatDate(this.parseLocalDate(end));

        this.sellersService.getCommissions(fromDate, toDate).subscribe({
          next: (res) => {
            this.comission = res.sort((a, b) => b.faturado - a.faturado);
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Erro ao filtrar intervalo personalizado:', err),
        });
        return;
      } else {
        this.sellersService.getCommissions(fromDate).subscribe({
          next: (res) => {
            this.comission = res.sort((a, b) => b.faturado - a.faturado);
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Erro ao filtrar data inicial personalizada:', err),
        });
      }
      return;
    }

    this.showCustomDatePicker = false;

    switch (selectedRange) {
      case 'today':
        break;

      case 'yesterday':
        startDate.setDate(now.getDate() - 1);
        const y = this.formatDate(startDate);

        this.sellersService.getCommissions(y).subscribe({
          next: (res) => {
            this.comission = res.sort((a, b) => b.faturado - a.faturado);
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Erro ao filtrar ontem:', err),
        });
        return;

      case 'last7':
        startDate.setDate(now.getDate() - 7);
        break;

      case 'last15':
        startDate.setDate(now.getDate() - 15);
        break;

      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const f = this.formatDate(startDate);
        endDate.setDate(endDate.getDate() + 1);
        const t = this.formatDate(endDate);

        this.sellersService.getCommissions(f, t).subscribe({
          next: (res) => {
            this.comission = res.sort((a, b) => b.faturado - a.faturado);
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Erro ao filtrar mês atual:', err),
        });
        return;

      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of previous month

        const lastMonthFrom = this.formatDate(startDate);
        const lastMonthTo = this.formatDate(endDate);

        this.sellersService.getCommissions(lastMonthFrom, lastMonthTo).subscribe({
          next: (res) => {
            this.comission = res.sort((a, b) => b.faturado - a.faturado);
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Erro ao filtrar mês passado:', err),
        });
        return;

      case 'lastWeek':
        const dayOfWeek = now.getDay(); // 0 = Domingo, 6 = Sábado

        startDate.setDate(now.getDate() - dayOfWeek - 7); // Domingo da semana passada
        startDate.setHours(0, 0, 0, 0);

        endDate.setDate(now.getDate() - dayOfWeek - 1); // Sábado da semana passada
        endDate.setHours(23, 59, 59, 999);

        const lastWeekFrom = this.formatDate(startDate);
        const lastWeekTo = this.formatDate(endDate);

        this.sellersService.getCommissions(lastWeekFrom, lastWeekTo).subscribe({
          next: (res) => {
            this.comission = res.sort((a, b) => b.faturado - a.faturado);
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Erro ao filtrar semana passada:', err),
        });
        return;

      default:
        startDate = new Date(0);
        break;
    }

    const fromDate = this.formatDate(startDate);

    this.sellersService.getCommissions(fromDate).subscribe({
      next: (res) => {
        this.comission = res.sort((a, b) => b.faturado - a.faturado);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao filtrar por data:', err),
    });
  }

  private parseLocalDate(iso: string): Date {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  get comissionSorted(): Commissions[] {
    return [...this.comission].sort((a, b) => b.faturado - a.faturado);
  }
}
