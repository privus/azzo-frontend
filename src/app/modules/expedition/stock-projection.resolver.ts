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
    return this.expeditionService.getExpedition();
  }
}
