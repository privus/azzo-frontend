import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { StatusAnalyticsByRegion, StatusAnalyticsResolvedData } from '../models';
import { CustomerService } from 'src/app/modules/commerce/services/customer.service';

@Injectable({
  providedIn: 'root',
})
export class StatusAnalyticsResolver implements Resolve<StatusAnalyticsResolvedData> {
  private regioesIds: number[] = [5, 7, 6, 4, 10, 2];

  constructor(private customerService: CustomerService) {}

  resolve(): Observable<StatusAnalyticsResolvedData> {
    return this.customerService.getStatusDates().pipe(
      switchMap((dates: string[]) => {

        const normalizedDates = dates.map((d) => d.substring(0, 10));
        const sortedDates = normalizedDates.sort((a, b) => b.localeCompare(a));

        const penultima = sortedDates[1];

        const observables = this.regioesIds.map((regiaoId) => this.customerService.getStatusHistory(regiaoId, penultima));

        return forkJoin(observables).pipe(
          // 🔥 junta tudo
          map((analytics) => ({
            dates: sortedDates,
            analytics,
          })),
        );
      }),
    );
  }
}
