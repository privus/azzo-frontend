import { UpdateSellPerson, UpdateSellStatus } from './../models/';
import { Injectable } from '@angular/core';
import { SellService } from '../../../core/services';
import { PGenerateCredit } from '../../financial/models';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private readonly sellService: SellService) {}

  getAllOrders() {
    return this.sellService.getAllOrders();
  }

  getOrdersBetweenDates(startDate: string, endDate?: string) {
    const end = endDate ? `&toDate=${endDate}` : '';
    return this.sellService.getOrdersByDateRange(startDate, end);
  }

  getOrdersBetweenDatesP(startDate: string, endDate?: string) {
    const end = endDate ? `&toDate=${endDate}` : '';
    return this.sellService.getOrdersByDateRangeP(startDate, end);
  }

  addVolumeSell(id: number, volume: number) {
    return this.sellService.addVolumeSell(id, volume);
  }

  getOrderById(id: number) {
    return this.sellService.getOrderById(id);
  }

  getOrderByIdP(id: number) {
    return this.sellService.getOrderByIdP(id);
  }

  getOrdersByDate(fromDate: string) {
    return this.sellService.getOrdersByDate(fromDate);
  }

  getOrdersByDateP(fromDate: string) {
    return this.sellService.getOrdersByDateP(fromDate);
  }

  syncroAllOrders() {
    return this.sellService.syncroAllOrders();
  }

  updateSellStatus(UpdateSellStatusDto: UpdateSellStatus) {
    return this.sellService.updateSellStatus(UpdateSellStatusDto);
  }

  updateSellStatusP(UpdateSellStatusDto: UpdateSellPerson) {
    return this.sellService.updateSellStatusP(UpdateSellStatusDto);
  }

  exportTiny(id: number) {
    return this.sellService.exportTiny(id);
  }

  getSellerRanking() {
    return this.sellService.getSellerRanking();
  }

  getPerformanceSales(fromDate1: string, toDate1: string, fromDate2: string, toDate2: string) {
    return this.sellService.performanceSales(fromDate1, toDate1, fromDate2, toDate2);
  }

  uploadFiles(vendaId: number, files: File[]) {
    return this.sellService.uploadFiles(vendaId, files);
  }

  syncroInvoiceNf() {
    return this.sellService.syncroInvoiceNf();
  }

  deleteSell(id: number) {
    return this.sellService.deleteOrder(id);
  }

  getInProduction() {
    return this.sellService.getInProduction();
  }

  generatorinstallments(orderId: number, parcelas: PGenerateCredit[]) {
    return this.sellService.installmentGenerate(orderId, parcelas);
  }

  getAllPaymentMethods() {
    return this.sellService.getAllPaymentMethods();
  }

  deleteNfData(id: number) {
    return this.sellService.deleteNfData(id);
  }
}
