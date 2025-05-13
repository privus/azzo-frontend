import { Injectable } from '@angular/core';
import { LogisticsService } from '../../../core/services/logistics.service';

@Injectable({
  providedIn: 'root',
})
export class ExpeditionService {
  constructor(private readonly logisticsService: LogisticsService) {}

  getExpedition() {
    return this.logisticsService.getStockProjection();
  }

  getRomaneio() {
    return this.logisticsService.getRomaneio();
  }
}
