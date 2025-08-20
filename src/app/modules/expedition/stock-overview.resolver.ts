import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ExpeditionService } from './services/expedition.service';
import { StockOverview } from './models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockOverviewResolver implements Resolve<StockOverview | null> {
  constructor(private expeditionService: ExpeditionService) {}

  resolve(): Observable<StockOverview | null> {
    return this.expeditionService.getStockOverview();
  }
}
