import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StatusAnalyticsByRegion } from '../models';
import { CustomerService } from 'src/app/modules/commerce/services/customer.service';

@Injectable({
  providedIn: 'root',
})
export class StatusAnalyticsResolver implements Resolve<StatusAnalyticsByRegion[]> {
  private regioesIds: number[] = [5, 7, 6, 4, 10, 2];

  constructor(private customerService: CustomerService) {}

  resolve(): Observable<StatusAnalyticsByRegion[]> {
    return this.customerService.getStatusDates().pipe(
      switchMap((dates: string[]) => {
        if (!dates || dates.length < 2) {
          throw new Error('Datas insuficientes');
        }

        // 🔥 garante formato YYYY-MM-DD
        const normalizedDates = dates.map((d) => d.substring(0, 10));

        // ordenar (mais recente primeiro)
        const sortedDates = normalizedDates.sort((a, b) => b.localeCompare(a));

        const penultima: string = sortedDates[1];

        const observables = this.regioesIds.map((regiaoId) => this.customerService.getStatusHistory(regiaoId, penultima));

        return forkJoin(observables);
      }),
    );
  }
}
