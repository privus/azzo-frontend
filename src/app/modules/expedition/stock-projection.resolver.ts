import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { StockProjection } from './models';
import { ExpeditionService } from './services/expedition.service';

@Injectable({
  providedIn: 'root',
})
export class StockProjectionResolver implements Resolve<StockProjection[] | null> {
  constructor(private expeditionService: ExpeditionService) {}

  resolve(): Observable<StockProjection[] | null> {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 7);
    const now = new Date();
    const formattedNow = now.toISOString().split('T')[0];
    const formatted = fifteenDaysAgo.toISOString().split('T')[0];

    return this.expeditionService.getExpedition(formatted, formattedNow);
  }
}
