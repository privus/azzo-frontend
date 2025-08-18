import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Distributor, StockById, StockLiquid, StockOut, StockProjection } from '../../modules/expedition/models';
import { NewRomaneio, Romaneio, Transportadora, StockDuration } from '../../modules/expedition/models';
;

@Injectable()
export class LogisticsService {
  private baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getStockProjection() {
    return this.http.get<StockProjection[]>(`${this.baseUrl}sells/projectStock`);
  }

  getRomaneio() {
    return this.http.get<Romaneio[]>(`${this.baseUrl}sells/romaneio`);
  }

  getAllTrans() {
    return this.http.get<Transportadora[]>(`${this.baseUrl}sells/trans`);
  }

  createRomaneio(romaneio: NewRomaneio) {
    return this.http.post<{ message: string }>(`${this.baseUrl}sells/romaneio`, romaneio);
  }

  getStockLiquid() {
    return this.http.get<StockLiquid[]>(`${this.baseUrl}stock/liquid`);
  }

  getDistributors() {
    return this.http.get<Distributor[]>(`${this.baseUrl}stock/dist`);
  }

  getStockOut(saida: StockOut) {
    return this.http.post<{ message: string }>(`${this.baseUrl}stock/stockOut`, saida);
  }

  getStockOutById(id: number) {
    return this.http.get<StockById[]>(`${this.baseUrl}stock/out/${id}`);
  }

  getDurationProduct() {
    return this.http.get<StockDuration[]>(`${this.baseUrl}stock/duration`);
  }
}
