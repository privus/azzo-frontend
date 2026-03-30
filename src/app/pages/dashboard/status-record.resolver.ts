import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { SellersService } from '../../../app/modules/sellers/services/sellers.service';
import { StatusRecord } from '../models';

@Injectable({
  providedIn: 'root',
})
export class StatusRecordeResolver implements Resolve<StatusRecord[]> {
  constructor(private sellerService: SellersService) {}

  resolve(): Observable<StatusRecord[]> {
    return this.sellerService.getStatusRecord();
  }
}
