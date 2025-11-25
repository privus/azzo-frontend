import { Injectable } from '@angular/core';
import { LogisticsService } from '../../../core/services/logistics.service';
import { NewRomaneio, StockOut } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ExpeditionService {
  constructor(private readonly logisticsService: LogisticsService) {}

  getStockProjection() {
    return this.logisticsService.getStockProjection();
  }

  getRomaneio() {
    return this.logisticsService.getRomaneio();
  }

  getAllTrans() {
    return this.logisticsService.getAllTrans();
  }

  createRomaneio(romaneio: NewRomaneio) {
    return this.logisticsService.createRomaneio(romaneio);
  }

  getStockLiquid() {
    return this.logisticsService.getStockLiquid();
  }

  getDistributors() {
    return this.logisticsService.getDistributors();
  }

  getStockOut(saida: StockOut) {
    return this.logisticsService.getStockOut(saida);
  }

  getStockOutById(id: number) {
    return this.logisticsService.getStockOutById(id);
  }

  getStockOverview() {
    return this.logisticsService.getStockOverview();
  }

  getNfsResume() {
    return this.logisticsService.getNfsResume();
  }

  getXml(numeroNfe: string) {
    return this.logisticsService.getXml(numeroNfe);
  }

  productsArrived(numeroNfe: string) {
    return this.logisticsService.arrived(numeroNfe);
  }

  reimportProducts(numeroNfe: string) {
    return this.logisticsService.reimport(numeroNfe);
  }

  getStockOutByEcommerceId(id: number) {
    return this.logisticsService.getStockOutByEcommerceId(id);
  }
}
