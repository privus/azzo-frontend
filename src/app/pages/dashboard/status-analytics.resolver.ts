import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { StatusAnalyticsByRegion } from '../models';
import { CustomerService } from 'src/app/modules/commerce/services/customer.service';

@Injectable({
  providedIn: 'root',
})
export class StatusAnalyticsResolver implements Resolve<StatusAnalyticsByRegion[]> {
  private regioesIds: number[] = [5, 7, 6, 4, 10, 2];

  constructor(private customerService: CustomerService) {}

  resolve(): Observable<StatusAnalyticsByRegion[]> {
    const dataRegistro = new Date();
    dataRegistro.setDate(dataRegistro.getDate() - 15);

    const observables = this.regioesIds.map((regiaoId) => this.customerService.getStatusHistory(regiaoId, dataRegistro));

    return forkJoin(observables);
  }
}
