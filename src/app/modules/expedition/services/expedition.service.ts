import { Injectable } from '@angular/core';
import { LogisticsService } from '../../../core/services/logistics.service';

@Injectable({
  providedIn: 'root',
})
export class ExpeditionService {
  constructor(private readonly logisticsService: LogisticsService) {}

  getExpedition(fromDate: string, toDate: string, statusVendaIds?: string) {
    const status_id = statusVendaIds ? `&statusVendaIds=${statusVendaIds}` : '';
    return this.logisticsService.getStockProjection(fromDate, toDate, status_id);
  }
}
