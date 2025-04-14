import { Component, OnInit } from '@angular/core';
import { Commissions } from '../models';
import { ActivatedRoute } from '@angular/router';
import { SellersService } from '../services/sellers.service';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss'],
})
export class CommissionsComponent implements OnInit {
  comission: Commissions[] = [];
  dataRange: string = 'lastMonth';
  showCustomDatePicker = false;

  customDateRange = { start: '', end: '' };

  constructor(
    private route: ActivatedRoute,
    private sellersService: SellersService,
  ) {}

  ngOnInit(): void {
    const snapshotData = this.route.snapshot.data['commissions'];
    this.comission = Array.isArray(snapshotData) ? snapshotData.sort((a, b) => b.faturado - a.faturado) : [];

    console.log('Commissions ordenadas por faturado (snapshot):', this.comission);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onDateRange(): void {
    const selectedRange = this.dataRange;

    let startDate = new Date();
    let endDate = new Date();

    if (selectedRange === 'custom') {
      this.showCustomDatePicker = true;

      const start = this.customDateRange.start;
      const end = this.customDateRange.end;

      if (!start) return;

      const from = new Date(start);
      from.setDate(from.getDate());
      const fromDate = this.formatDate(from);

      if (end) {
        const to = new Date(end);
        to.setDate(to.getDate() + 1);
        const toDate = this.formatDate(to);

        this.updateCommission(fromDate, toDate);
      } else {
        this.updateCommission(fromDate);
      }

      return;
    }

    this.showCustomDatePicker = false;

    switch (selectedRange) {
      case 'yesterday':
        startDate.setDate(startDate.getDate() - 1);
        const y = this.formatDate(startDate);
        this.updateCommission(y);
        return;

      case 'last7':
        startDate.setDate(startDate.getDate() - 7);
        break;

      case 'last15':
        startDate.setDate(startDate.getDate() - 15);
        break;

      case 'thisMonth':
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        const f = this.formatDate(startDate);
        endDate.setDate(endDate.getDate() + 1);
        const t = this.formatDate(endDate);
        this.updateCommission(f, t);
        return;

      case 'lastMonth':
        startDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        endDate.setDate(endDate.getDate() + 1);
        const lastMonthFrom = this.formatDate(startDate);
        const lastMonthTo = this.formatDate(endDate);
        this.updateCommission(lastMonthFrom, lastMonthTo);
        return;

      case 'lastWeek':
        const dayOfWeek = startDate.getDay();
        startDate.setDate(startDate.getDate() - dayOfWeek - 7);
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(startDate.getDate() - dayOfWeek - 1);
        endDate.setHours(23, 59, 59, 999);
        const lastWeekFrom = this.formatDate(startDate);
        const lastWeekTo = this.formatDate(endDate);
        this.updateCommission(lastWeekFrom, lastWeekTo);
        return;

      default:
        // Do nothing special, just set startDate to today
        break;
    }

    const fromDate = this.formatDate(startDate);
    const toDate = this.formatDate(endDate);
    this.updateCommission(fromDate, toDate);
  }

  private updateCommission(from: string, to?: string) {
    const positivity$ = to ? this.sellersService.getCommissions(from, to) : this.sellersService.getCommissions(from);

    positivity$.subscribe((res) => {
      this.comission = res.sort((a, b) => b.faturado - a.faturado);
      console.log('Commissions ordenadas por faturado:', this.comission);
    });
  }
}
