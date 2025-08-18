import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ExpeditionService } from './services/expedition.service';
import { StockDuration } from './models/stock-resp.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DurationProductResolver implements Resolve<StockDuration[] | null> {
  constructor(private expeditionService: ExpeditionService) {}

  resolve(): Observable<StockDuration[] | null> {
    return this.expeditionService.getDurationProduct();
  }
}
