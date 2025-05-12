import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { StockProjection } from '../../modules/expedition/models';

@Injectable()
export class LogisticsService {
  private baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getStockProjection(fromDate: string, toDate: string, statusVendaIds?: string): Observable<StockProjection[]> {
    return this.http.get<StockProjection[]>(`${this.baseUrl}sells/projectStock?fromDate=${fromDate}&toDate=${toDate}${statusVendaIds}`);
  }
}
